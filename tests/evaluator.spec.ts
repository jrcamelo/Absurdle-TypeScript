import { LetterState } from "../src/constants";
import Evaluator from "../src/evaluator";

const TESTS_TESTS: [string, LetterState][] = [
    ["t", LetterState.CORRECT],
    ["e", LetterState.CORRECT],
    ["s", LetterState.CORRECT],
    ["t", LetterState.CORRECT],
    ["s", LetterState.CORRECT]
];

const ERROR_TESTS: [string, LetterState][] = [
    ["e", LetterState.PRESENT],
    ["r", LetterState.ABSENT],
    ["r", LetterState.ABSENT],
    ["o", LetterState.ABSENT],
    ["r", LetterState.ABSENT]
];

const WRONG_TESTS: [string, LetterState][] = [
    ["w", LetterState.ABSENT],
    ["r", LetterState.ABSENT],
    ["o", LetterState.ABSENT],
    ["n", LetterState.ABSENT],
    ["g", LetterState.ABSENT]
];

describe("Evaluator", () => {
    it("should normalize guesses into lowercase", () => {
        expect(Evaluator.normalizeGuess("TeStS")).toBe("tests");
    });

    it("should remove non-letter characters from guess", () => {
        expect(Evaluator.normalizeGuess("té5t*")).toBe("tt");
    });

    it("should remove extra characters from guess", () => {
        expect(Evaluator.normalizeGuess("testsssssss")).toBe("tests");
    });

    it("should evaluate a correct guess correctly", () => {
        expect(Evaluator.evaluateGuess("tests", "tests")).toEqual(TESTS_TESTS);
    });

    it("should evaluate an incorrect guess correctly", () => {
        expect(Evaluator.evaluateGuess("tests", "wrong")).toEqual(WRONG_TESTS);
    });

    it("should evaluate a slightly correct guess correctly", () => {
        expect(Evaluator.evaluateGuess("tests", "error")).toEqual(ERROR_TESTS);
    });

    it("should know when a guess is the same as the answer", () => {
        expect(Evaluator.isGuessCorrect("tests", "tests")).toBe(true);
    });

    it("should know when a guess is not the same as the answer", () => {
        expect(Evaluator.isGuessCorrect("tests", "wrong")).toBe(false);
    });

    it("should know when a guess is a valid word", () => {
        expect(Evaluator.isGuessValidWord("tests")).toBe(true);
        expect(Evaluator.isGuessValidWord("zzxzz")).toBe(false);
    });
});