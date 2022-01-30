import { LetterState } from "../src/constants";
import Status from "../src/status";

const DONE_STATUS = Status.fromArray([
    new Set(["a", "b", "c", "d", "e"]),
    new Set(["f", "g", "h", "i", "j"]),
    ["j", "k", "l", "m", "n"]
]);

const WORKING_STATUS = Status.fromArray([
    new Set(["a", "b", "c", "d", "e"]),
    new Set(["f", "g", "h", "i", "j"]),
    ["", "k", "l", "m", ""]
]);

describe("Status", () => {
    it("should be created empty", () => {
        const status = new Status();
        expect(status.absentLetters).toEqual(new Set([]));
        expect(status.presentLetters).toEqual(new Set([]));
        expect(status.correctLetters).toEqual(["", "", "", "", ""]);
    });

    it("should create a new status from an array", () => {
        const status = Status.fromArray([
            new Set(["a", "b", "c", "d", "e"]),
            new Set(["f", "g", "h", "i", "j"]),
            ["j", "k", "l", "m", "n"]
        ]);
        expect(status.absentLetters).toEqual(new Set(["a", "b", "c", "d", "e"]));
        expect(status.presentLetters).toEqual(new Set(["f", "g", "h", "i", "j"]));
        expect(status.correctLetters).toEqual(["j", "k", "l", "m", "n"]);
    });

    it("should create a new status from a previous status", () => {
        const status = new Status(DONE_STATUS);
        expect(status.absentLetters).toEqual(new Set(["a", "b", "c", "d", "e"]));
        expect(status.presentLetters).toEqual(new Set(["f", "g", "h", "i", "j"]));
        expect(status.correctLetters).toEqual(["j", "k", "l", "m", "n"]);
    });

    it("should add a guess to the status", () => {
        const status = new Status();
        status.update([
            ["a", LetterState.CORRECT],
            ["b", LetterState.ABSENT],
            ["c", LetterState.PRESENT],
            ["d", LetterState.ABSENT],
            ["e", LetterState.CORRECT]
        ]);
        expect(status.absentLetters).toEqual(new Set(["b", "d"]));
        expect(status.presentLetters).toEqual(new Set(["c"]));
        expect(status.correctLetters).toEqual(["a", "", "", "", "e"]);
    });

    it("should add a guess to a previous status", () => {
        const status = new Status(WORKING_STATUS);
        status.update([
            ["z", LetterState.CORRECT],
            ["a", LetterState.ABSENT],
            ["s", LetterState.PRESENT],
            ["d", LetterState.ABSENT],
            ["p", LetterState.CORRECT]
        ]);
        expect(status.absentLetters).toEqual(new Set(["a", "b", "c", "d", "e"]));
        expect(status.presentLetters).toEqual(new Set(["f", "g", "h", "i", "j", "s"]));
        expect(status.correctLetters).toEqual(["z", "k", "l", "m", "p"]);
    });

    it("should move a present letter to the correct letters", () => {
        const status = new Status();
        status.update([
            ["a", LetterState.PRESENT],
            ["b", LetterState.PRESENT],
            ["c", LetterState.CORRECT],
            ["d", LetterState.PRESENT],
            ["e", LetterState.PRESENT]
        ]);
        expect(status.presentLetters).toEqual(new Set(["a", "b", "d", "e"]));
        expect(status.correctLetters).toEqual(["", "", "c", "", ""]);
        status.update([
            ["e", LetterState.CORRECT],
            ["d", LetterState.CORRECT],
            ["c", LetterState.CORRECT],
            ["b", LetterState.CORRECT],
            ["a", LetterState.CORRECT]
        ]);
        expect(status.presentLetters).toEqual(new Set([]));
        expect(status.correctLetters).toEqual(["e", "d", "c", "b", "a"]);
    });
    
});