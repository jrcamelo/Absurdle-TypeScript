import { GameState, DEFAULT_LIVES, LetterState, IHintLetter, GameMode } from "../constants";
import Dictionary from "../dictionary";
import Evaluator from "../evaluator";
import Game from "./game";
import Status from "../status";
import TallyReport from "./tallyReport";

export default class Wordle implements Game {
    public answer: string;
    public hardMode: boolean;

    public tries: number;
    public gameState: GameState = GameState.PLAYING;
    public status: Status = new Status();
    public guesses: IHintLetter[][] = [];

    public dictionary: Dictionary;

    constructor(hardMode = false, tries: number = DEFAULT_LIVES) {
        this.dictionary = Dictionary.getInstance();
        this.answer = this.dictionary.getRandomSecret();
        this.hardMode = hardMode;
        this.tries = tries;
    }

    public static fromTally(tally: TallyReport): Wordle {
        const game = new Wordle(tally.hardMode, tally.tries);
        game.gameState = <GameState>tally.gameState;
        game.guesses = tally.guesses.map((guess: string[][]): IHintLetter[] =>
            guess.map((letter: string[]) => ({
                letter: letter[0],
                state: <LetterState>letter[1],
            })),
        );
        game.status.absentLetters = new Set(tally.absentLetters);
        game.status.presentLetters = new Set(tally.presentLetters);
        game.status.correctLetters = tally.correctLetters;
        game.answer = tally.answer;
        return game;
    }

    public tryGuess(guess: string): void {
        this.checkGameState();
        this.checkValidGuess(guess);

        guess = Evaluator.normalizeGuess(guess);
        const result = this.evaluateGuess(guess);
        this.updateStatusAndGuesses(result);
        this.checkForWinOrLoss(result);
    }

    public checkGameState(): void {
        if (this.gameState !== GameState.PLAYING) {
            throw new Error(`Game is not in playing state`);
        }
    }

    public checkValidGuess(guess: string): void {
        if (guess.length != 5) {
            throw new Error(`Guess must be 5 characters long`);
        }
        if (this.hardMode) {
            if (Evaluator.hasAbsentLetter(guess, this.status.absentLetters)) {
                throw new Error(`Guess contains absent letter in hard mode`);
            }
            if (!Evaluator.hasPresentLetters(guess, this.status.presentLetters)) {
                throw new Error(`Guess must contain all present letters`);
            }
            if (!Evaluator.hasCorrectLettersInPosition(guess, this.status.correctLetters)) {
                throw new Error(`Guess must contain correct letters in correct position`);
            }
        }
        if (!Evaluator.isGuessValidWord(guess)) {
            throw new Error(`Guess is not a valid word`);
        }
    }

    public evaluateGuess(guess: string): IHintLetter[] {
        return Evaluator.evaluateGuess(this.answer, guess);
    }

    public updateStatusAndGuesses(result: IHintLetter[]): void {
        this.guesses.push(result);
        this.status.update(result);
    }

    public getMode(): string {
        return this.hardMode ? GameMode.WORDLE_HARD : GameMode.WORDLE;
    }

    public guessesToList(): string[] {
        return this.guesses.map((guess: IHintLetter[]) => guess.map((letter: IHintLetter) => letter.letter).join(``));
    }

    public guessesToListOfGuesses(): string[][][] {
        return this.guesses.map((guess: IHintLetter[]) =>
            guess.map((letter: IHintLetter) => [letter.letter, letter.state]),
        );
    }

    public checkForWinOrLoss(result: IHintLetter[]): void {
        if (result.every((hint) => hint.state === LetterState.CORRECT)) {
            this.gameState = GameState.WON;
        } else {
            this.tries--;
            if (this.tries === 0) {
                this.gameState = GameState.LOST;
            }
        }
    }

    public toTally() {
        return TallyReport.fromWordle(this);
    }

    public toDatabaseTally(userToken: string) {
        return TallyReport.fromWordle(this).toDatabaseJson(userToken);
    }

    public toUserJson() {
        return TallyReport.fromWordle(this).toUserJson();
    }
}
