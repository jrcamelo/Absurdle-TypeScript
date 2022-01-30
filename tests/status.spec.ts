import { LetterState } from "../src/constants";
import Status from "../src/status";

const DONE_STATUS = Status.fromArray([
    ["a", "b", "c", "d", "e"],
    ["f", "g", "h", "i", "j"],
    ["j", "k", "l", "m", "n"]
]);

const WORKING_STATUS = Status.fromArray([
    ["a", "b", "c", "d", "e"],
    ["f", "g", "h", "i", "j"],
    ["", "k", "l", "m", ""]
]);

describe("Status", () => {
    it("should be created empty", () => {
        const status = new Status();
        expect(status.absentLetters).toEqual([]);
        expect(status.presentLetters).toEqual([]);
        expect(status.correctLetters).toEqual(["", "", "", "", ""]);
    });

    it("should create a new status from an array", () => {
        const status = Status.fromArray([
            ["a", "b", "c", "d", "e"],
            ["f", "g", "h", "i", "j"],
            ["j", "k", "l", "m", "n"]
        ]);
        expect(status.absentLetters).toEqual(["a", "b", "c", "d", "e"]);
        expect(status.presentLetters).toEqual(["f", "g", "h", "i", "j"]);
        expect(status.correctLetters).toEqual(["j", "k", "l", "m", "n"]);
    });

    it("should create a new status from a previous status", () => {
        const status = new Status(DONE_STATUS);
        expect(status.absentLetters).toEqual(["a", "b", "c", "d", "e"]);
        expect(status.presentLetters).toEqual(["f", "g", "h", "i", "j"]);
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
        expect(status.absentLetters).toEqual(["b", "d"]);
        expect(status.presentLetters).toEqual(["c"]);
        expect(status.correctLetters).toEqual(["a", "", "", "", "e"]);
    });

    it("should add a guess to a previous status", () => {
        const status = new Status(WORKING_STATUS);
        status.update([
            ["z", LetterState.CORRECT],
            ["x", LetterState.ABSENT],
            ["c", LetterState.PRESENT],
            ["v", LetterState.ABSENT],
            ["b", LetterState.CORRECT]
        ]);
        expect(status.absentLetters).toEqual(["a", "b", "c", "d", "e", "x", "v"]);
        expect(status.presentLetters).toEqual(["f", "g", "h", "i", "j", "c"]);
        expect(status.correctLetters).toEqual(["z", "k", "l", "m", "b"]);
    });
    
});