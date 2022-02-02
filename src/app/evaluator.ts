import { LetterState } from "./constants";
import Dictionary from "./dictionary";
import { IHintLetter } from "./constants";

export default class Evaluator {
    static evaluateGuess(answer: string, guess: string): IHintLetter[] {
        const result: IHintLetter[] = [];
        for (let i = 0; i < 5; i++) {
            if (guess[i] === answer[i]) {
                result.push({ letter: guess[i], state: LetterState.CORRECT });
            } else if (answer.includes(guess[i])) {
                const presentCount = result.filter((l) => l.state === LetterState.PRESENT).length;
                const answerCount = answer.split(``).filter((l) => l === guess[i]).length;
                if (presentCount < answerCount) {
                    result.push({
                        letter: guess[i],
                        state: LetterState.PRESENT,
                    });
                } else {
                    result.push({
                        letter: guess[i],
                        state: LetterState.ABSENT,
                    });
                }
            } else {
                result.push({ letter: guess[i], state: LetterState.ABSENT });
            }
        }
        return result;
    }

    static isGuessValidWord(guess: string): boolean {
        return Dictionary.getInstance().isValidWord(guess);
    }

    static hasAbsentLetter(guess: string, absentLetters: Set<string>) {
        for (let i = 0; i < 5; i++) {
            if (absentLetters.has(guess[i])) {
                return true;
            }
        }
        return false;
    }

    static hasPresentLetters(guess: string, present: Set<string>): boolean {
        for (const p of present) {
            if (!guess.includes(p)) {
                return false;
            }
        }
        return true;
    }

    static hasCorrectLettersInPosition(guess: string, correct: string[]): boolean {
        if (correct.every((letter) => letter === ``)) {
            return true;
        }
        for (let i = 0; i < 5; i++) {
            if (correct[i] && correct[i] !== guess[i]) {
                return false;
            }
        }
        return true;
    }

    static isGuessCorrect(answer: string, guess: string): boolean {
        return guess === answer;
    }

    static normalizeGuess(guess: string): string {
        guess = guess.substring(0, 5).toLowerCase();
        return guess.replace(/[^a-z]/g, ``);
    }
}
