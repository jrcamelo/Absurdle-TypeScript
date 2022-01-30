import { GameState, DEFAULT_LIVES, LetterState } from './constants';
import Dictionary from './dictionary';
import Evaluator from './evaluator';
import Status from './status';

export default class Wordle {

    public answer: string;
    public tries: number = DEFAULT_LIVES;
    public gameState: GameState = GameState.PLAYING;
    public status: Status = new Status;
    public guesses: [string, LetterState][][] = [];

    private dictionary: Dictionary;

    constructor() {
        this.dictionary = Dictionary.getInstance();
        this.answer = this.dictionary.getRandomSecret();
        // TODO: Remove this log
        console.log(this.answer);
    }

    public tryGuess(guess: string): void {
        if (this.gameState !== GameState.PLAYING) {
            throw new Error("Game is not in playing state");
        }
        guess = Evaluator.normalizeGuess(guess);
        if (guess.length != 5) {
            throw new Error("Guess must be 5 characters long");
        }
        if (Evaluator.isGuessCorrect(this.answer, guess)) {
            this.gameState = GameState.WON;
            return;
        }
        const result = Evaluator.evaluateGuess(this.answer, guess);
        this.guesses.push(result);
        this.status.update(result);
        this.tries--;
        if (this.tries === 0) {
            this.gameState = GameState.LOST;
        }
    }

    public toTally(): Map<string, any> {
        const tally = new Map<string, any>();
        tally.set("gameState", this.gameState);
        tally.set("tries", this.tries);
        tally.set("guesses", this.guesses);
        tally.set("absentLetters", this.status.absentLetters);
        tally.set("presentLetters", this.status.presentLetters);
        tally.set("correctLetters", this.status.correctLetters);
        return tally;
    }


}