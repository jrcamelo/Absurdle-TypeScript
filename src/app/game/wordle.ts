import { GameState, DEFAULT_LIVES, LetterState, IHintLetter, GameMode } from "../constants";
import Dictionary from "../dictionary";
import Evaluator from "../evaluator";
import Game from "./game";
import Status from "../status";
import TallyReport from "./tallyReport";
import GameError from '@/utils/gameError';

export default class Wordle implements Game {
    public answer: string;
    public hardMode: boolean;
    public createdAt: Date;

    public tries: number;
    public gameState: GameState = GameState.PLAYING;
    public status: Status = new Status();
    public guesses: IHintLetter[][] = [];

    public dictionary: Dictionary;

    constructor(hardMode = false, code?: string, tries: number = DEFAULT_LIVES) {
        this.dictionary = Dictionary.getInstance();
        this.answer = this.dictionary.getRandomSecret();
        if (code) {
            console.log(`code: ${code}`);
            const secret = this.dictionary.getAnswerFromCode(code)
            console.log(`secret: ${secret}`);
            if (secret) {
                this.answer = secret;
            }
        }
        this.hardMode = hardMode;
        this.tries = tries;
        this.createdAt = new Date();
    }
    
    public static fromJson(json: any): Wordle {
        const game = new Wordle(json[`mode`] == GameMode.WORDLE_HARD, undefined, json[`tries`] || 0);
        game.gameState = json[`gameState`];
        game.status = new Status(undefined, json);
        game.loadGuesses(json[`guesses`]);
        game.answer = json[`answer`];
        game.createdAt = json[`createdAt`]
        return game;
    }

    public static fromTally(tally: TallyReport): Wordle {
        const game = new Wordle(tally.hardMode, undefined, tally.tries);
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
        game.createdAt = tally.createdAt;
        return game;
    }

    public tryGuess(guess: string): void {
        this.checkGameState();
        this.checkValidGuess(guess);

        guess = Evaluator.normalizeGuess(guess);
        if (this.guessesToList().includes(guess)) {
            throw new GameError(`You already guessed ${guess}`);
        }

        const result = this.evaluateGuess(guess);
        this.updateStatusAndGuesses(result);
        this.checkForWinOrLoss(result);
    }

    public getRandomGuess(): string {
        if (this.hardMode) {
            throw new GameError("Cannot generate random guess in hard mode");
        }
        return this.dictionary.getRandomSecret();
    }

    public checkGameState(): void {
        if (this.gameState !== GameState.PLAYING) {
            throw new GameError(`Game is not in playing state`);
        }
    }

    public checkValidGuess(guess: string): void {
        if (!guess) {
            throw new GameError(`Guess cannot be empty`);
        } else if (guess.length != 5) {
            throw new GameError(`Guess must be 5 characters long`);
        } else if (!Evaluator.isGuessValidWord(guess)) {
            throw new GameError(`Guess is not a valid word`);
        } else if (this.hardMode) {
            if (Evaluator.hasAbsentLetter(guess, this.status.absentLetters)) {
                throw new GameError(`Guess contains absent letter in hard mode`);
            } else if (!Evaluator.hasPresentLetters(guess, this.status.presentLetters)) {
                throw new GameError(`Guess must contain all present letters`);
            } else if (!Evaluator.hasCorrectLettersInPosition(guess, this.status.correctLetters)) {
                throw new GameError(`Guess must contain correct letters in correct position`);
            }
        }        
    }

    public evaluateGuess(guess: string): IHintLetter[] {
        return Evaluator.evaluateGuess(this.answer, guess);
    }

    public updateStatusAndGuesses(result: IHintLetter[]): void {
        this.guesses.push(result);
        this.status.update(result);
    }

    public loadGuesses(guesses: string[][][]): void {
        this.guesses = guesses.map((guess: string[][]) => {
            return guess.map((letter: string[]) => ({
                letter: letter[0],
                state: <LetterState>letter[1],
            }));
        });
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
        return TallyReport.fromWordle(this).toUserJson(this.dictionary.getCodeForAnswer(this.answer));
    }
}
