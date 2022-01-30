import Evaluator from "./evaluator";
import Wordle from "./wordle";
import { ABSURDLE_LIVES, GameState, IHintLetter } from './constants';

interface IStatusGroup {
    status: IHintLetter[];
    amount: number;
}

export default class Absurdle extends Wordle {
    public wordBucket: string[] = [];

    constructor(hardMode: boolean = false, tries: number = ABSURDLE_LIVES) {
        super(hardMode, tries);
        this.wordBucket = this.dictionary.getSecrets();
        this.answer = "-----";
    }

    public evaluateGuess(guess: string): IHintLetter[] {
        return this.evaluateGuessAndUpdateWordBucket(guess);
    }

    public evaluateGuessAndUpdateWordBucket(guess: string): IHintLetter[] {
        const [ statuses, buckets ] = this.checkEveryWord(guess);
        const groupedStatuses = this.groupStatuses(statuses);
        const mostCommonStatus = this.getMostCommonStatus(groupedStatuses); 
        const largestBucket = buckets.get(JSON.stringify(mostCommonStatus));
        this.wordBucket = largestBucket || [];
        return mostCommonStatus;
    }

    private checkEveryWord(guess: string): [IHintLetter[][], Map<string, string[]>] {
        let statuses: IHintLetter[][] = [];
        let buckets: Map<string, string[]> = new Map();
        for (let word of this.wordBucket.values()) {
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
        let groupedStatuses = new Map<string, IStatusGroup>();
        for (let status of statuses) {
            const stateString = JSON.stringify(status);
            const count = groupedStatuses.get(stateString)?.amount || 0;
            groupedStatuses.set(stateString, { status: status, amount: count + 1 });
        }
        return groupedStatuses;
    }

    private getMostCommonStatus(groupedStatus: Map<string, IStatusGroup>): IHintLetter[] {
        const sorted = Array.from(groupedStatus.values()).sort((a, b) => b.amount - a.amount);
        return sorted[0].status;
    }

    public getRemainingWords(): number {
        return this.wordBucket.length
    }

    public getRandomRemainingWord(): string {
        return this.wordBucket[Math.floor(Math.random() * this.wordBucket.length)];
    }

    public toTally(): Map<string, any> {
        const tally = super.toTally();
        tally.set("remainingWords", this.wordBucket.length);
        if (this.gameState !== GameState.PLAYING) {
            tally.set("answer", this.getRandomRemainingWord());
        }
        return tally;
    }

}