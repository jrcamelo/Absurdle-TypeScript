import { LetterState } from "./constants";
import Dictionary from "./dictionary";
import { IHintLetter } from "./constants";

export default class Evaluator {
    static evaluateGuess(answer: string, guess: string): IHintLetter[] {
        let result: IHintLetter[] = [];
        Evaluator.addEveryLetterAsAbsent(result, guess);
        Evaluator.addCorrectAndPresentLetters(result, answer);
        return result;
    }

    static addEveryLetterAsAbsent(result: IHintLetter[], guess: string): void {
        for (let i = 0; i < 5; i++) {
            result.push({ letter: guess[i], state: LetterState.ABSENT });
        }
    }

    static addCorrectAndPresentLetters(result: IHintLetter[], answer: string): void {
        const countInAnswer = Evaluator.getLetterCountInWord(answer);
        // Get correct letters
        for (let i = 0; i < 5; i++) {
            const letter = result[i].letter;
            if (letter === answer[i]) {
                result[i].state = LetterState.CORRECT;
                let count = countInAnswer.get(letter)!;
                countInAnswer.set(letter, count - 1);
            }
        }

        // Get present letters
        for (let i = 0; i < 5; i++) {
            if (result[i].state === LetterState.ABSENT) {
                const letter = result[i].letter;
                if (countInAnswer.has(letter) && countInAnswer.get(letter)! > 0) {
                    result[i].state = LetterState.PRESENT;
                    let count = countInAnswer.get(letter)!;
                    countInAnswer.set(letter, count - 1);
                }
            }
        }
    }

    private static getLetterCountInWord(word: string): Map<string, number> {
        const count = new Map<string, number>();
        for (const letter of word) {
            count.set(letter, (count.get(letter) || 0) + 1);
        }
        return count;
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
