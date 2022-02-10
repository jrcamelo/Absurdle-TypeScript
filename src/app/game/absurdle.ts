import Evaluator from "../evaluator";
import Wordle from "./wordle";
import { ABSURDLE_LIVES, GameMode, GameState, IHintLetter, LetterState } from "../constants";
import TallyReport from "./tallyReport";
import Status from "../status";

interface IStatusGroup {
    status: IHintLetter[];
    amount: number;
}

export default class Absurdle extends Wordle {
    public wordBucket: string[] = [];

    constructor(hardMode = false, tries: number = ABSURDLE_LIVES) {
        super(hardMode, undefined, tries);
        this.wordBucket = this.dictionary.getSecrets();
        this.answer = `-----`;
    }
    
    public static fromJson(json: any): Absurdle {
        const game = new Absurdle(json[`mode`] == GameMode.ABSURDLE_HARD, json[`tries`] || 0);
        game.gameState = json[`gameState`];
        game.status = new Status(undefined, json);
        game.loadGuesses(json[`guesses`]);
        return game;
    }

    public static fromTally(tally: TallyReport): Absurdle {
        const game = new Absurdle(tally.hardMode, tally.tries);
        game.gameState = <GameState>tally.gameState;
        game.status.absentLetters = new Set(tally.absentLetters);
        game.status.presentLetters = new Set(tally.presentLetters);
        game.status.correctLetters = tally.correctLetters;
        game.loadGuesses(tally.guesses);
        return game;
    }

    public evaluateGuess(guess: string): IHintLetter[] {
        return this.evaluateGuessAndUpdateWordBucket(guess);
    }
    
    public loadGuesses(guesses: string[][][]): void {
        super.loadGuesses(guesses);
        for (const guess of this.guessesToList()) {
            this.evaluateGuessAndUpdateWordBucket(guess);
        }
    }

    public evaluateGuessAndUpdateWordBucket(guess: string): IHintLetter[] {
        const [statuses, buckets] = this.checkEveryWord(guess);
        const groupedStatuses = this.groupStatuses(statuses);
        const mostCommonStatus = this.getMostCommonStatus(groupedStatuses);
        const largestBucket = buckets.get(JSON.stringify(mostCommonStatus));
        this.wordBucket = largestBucket || [];
        return mostCommonStatus;
    }

    private checkEveryWord(guess: string): [IHintLetter[][], Map<string, string[]>] {
        const statuses: IHintLetter[][] = [];
        const buckets: Map<string, string[]> = new Map();
        for (const word of this.wordBucket.values()) {
            const result = Evaluator.evaluateGuess(word, guess);
            statuses.push(result);

            const statusKey = JSON.stringify(result);
            const similarWords = buckets.get(statusKey) || [];
            similarWords.push(word);
            buckets.set(statusKey, similarWords);
        }
        return [statuses, buckets];
    }

    private groupStatuses(statuses: IHintLetter[][]): Map<string, IStatusGroup> {
        const groupedStatuses = new Map<string, IStatusGroup>();
        for (const status of statuses) {
            const stateString = JSON.stringify(status);
            const count = groupedStatuses.get(stateString)?.amount || 0;
            groupedStatuses.set(stateString, {
                status: status,
                amount: count + 1,
            });
        }
        return groupedStatuses;
    }

    private getMostCommonStatus(groupedStatus: Map<string, IStatusGroup>): IHintLetter[] {
        const sorted = Array.from(groupedStatus.values()).sort((a, b) => b.amount - a.amount);
        return sorted[0].status;
    }

    public getRemainingWords(): number {
        return this.wordBucket.length;
    }

    public getRandomRemainingWord(): string {
        return this.wordBucket[Math.floor(Math.random() * this.wordBucket.length)];
    }
    
    public checkForWinOrLoss(result: IHintLetter[]): void {
        super.checkForWinOrLoss(result);
        if (this.gameState == GameState.WON) {
            this.answer = this.wordBucket[0];
        };
    }

    public getMode(): string {
        return this.hardMode ? GameMode.ABSURDLE_HARD : GameMode.ABSURDLE;
    }

    public toTally() {
        return TallyReport.fromAbsurdle(this);
    }

    public toDatabaseTally(userToken: string) {
        return TallyReport.fromAbsurdle(this).toDatabaseJson(userToken);
    }

    public toUserJson() {
        return TallyReport.fromAbsurdle(this).toUserJson();
    }
}
