import { LetterState } from "../src/app/constants";
import Status from "../src/app/status";

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
            { letter: "a", state: LetterState.CORRECT },
            { letter: "b", state: LetterState.ABSENT },
            { letter: "c", state: LetterState.PRESENT },
            { letter: "d", state: LetterState.ABSENT },
            { letter: "e", state: LetterState.CORRECT }
        ]);
        expect(status.absentLetters).toEqual(new Set(["b", "d"]));
        expect(status.presentLetters).toEqual(new Set(["c"]));
        expect(status.correctLetters).toEqual(["a", "", "", "", "e"]);
    });

    it("should add a guess to a previous status", () => {
        const status = new Status(WORKING_STATUS);
        status.update([
            { letter: "z", state: LetterState.CORRECT },
            { letter: "a", state: LetterState.ABSENT },
            { letter: "s", state: LetterState.PRESENT },
            { letter: "d", state: LetterState.ABSENT },
            { letter: "p", state: LetterState.CORRECT }
        ]);
        expect(status.absentLetters).toEqual(new Set(["a", "b", "c", "d", "e"]));
        expect(status.presentLetters).toEqual(new Set(["f", "g", "h", "i", "j", "s"]));
        expect(status.correctLetters).toEqual(["z", "k", "l", "m", "p"]);
    });

    it("should move a present letter to the correct letters", () => {
        const status = new Status();
        status.update([
            { letter: "a", state: LetterState.PRESENT },
            { letter: "b", state: LetterState.PRESENT },
            { letter: "c", state: LetterState.CORRECT },
            { letter: "d", state: LetterState.PRESENT },
            { letter: "e", state: LetterState.PRESENT }
        ]);
        expect(status.presentLetters).toEqual(new Set(["a", "b", "d", "e"]));
        expect(status.correctLetters).toEqual(["", "", "c", "", ""]);
        status.update([
            { letter: "e", state: LetterState.CORRECT },
            { letter: "d", state: LetterState.CORRECT },
            { letter: "c", state: LetterState.CORRECT },
            { letter: "b", state: LetterState.CORRECT },
            { letter: "a", state: LetterState.CORRECT }
        ]);
        expect(status.presentLetters).toEqual(new Set([]));
        expect(status.correctLetters).toEqual(["e", "d", "c", "b", "a"]);
    });
    
});