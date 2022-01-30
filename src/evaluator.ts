import { LetterState } from "./constants";
import Dictionary from './dictionary';

export default class Evaluator {
    static evaluateGuess(answer: string, guess: string): [string, LetterState][] {
        const result: [string, LetterState][] = [];
        for (let i = 0; i < 5; i++) {
            if (guess[i] === answer[i]) {
                result.push([guess[i], LetterState.CORRECT]);
            } else if (answer.includes(guess[i])) {
                result.push([guess[i], LetterState.PRESENT]);
            } else {
                result.push([guess[i], LetterState.ABSENT]);
            }
        }
        return result;
    }

    static isGuessValidWord(guess: string): boolean {
        return Dictionary.getInstance().isValidWord(guess);
    }

    static isGuessCorrect(answer: string, guess: string): boolean {
        return guess === answer;
    }

    static normalizeGuess(guess: string): string {
        guess = guess.substring(0, 5).toLowerCase();
        return guess.replace(/[^a-z]/g, "");
    }
}