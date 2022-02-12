require('tsconfig-paths/register');
import Absurdle from '../src/app/game/absurdle';
import { GameState, ABSURDLE_LIVES } from '../src/app/constants';

const VICTORY_GUESSES = [
    "wrung",
    "aphid",
    "fable",
    "tacky",
    "slash",
    "medal",
    "octal",
]

describe("Absurdle", () => {
    it("should not have a fixed answer", () => {
        const absurdle = new Absurdle();
        expect(absurdle.answer).toBe("-----");
    });

    it("should have a default amount of tries", () => {
        const absurdle = new Absurdle();
        expect(absurdle.tries).toBe(ABSURDLE_LIVES);
    });

    it("should have a win game state on a full run", () => {
        const absurdle = new Absurdle();
        absurdle.tryGuess(VICTORY_GUESSES[0]);
        absurdle.tryGuess(VICTORY_GUESSES[1]);
        absurdle.tryGuess(VICTORY_GUESSES[2]);
        absurdle.tryGuess(VICTORY_GUESSES[3]);
        absurdle.tryGuess(VICTORY_GUESSES[4]);
        absurdle.tryGuess(VICTORY_GUESSES[5]);
        absurdle.tryGuess(VICTORY_GUESSES[6]);
        expect(absurdle.gameState).toBe(GameState.WON);
    });

    it("should decrease the amount of remaining words as player makes correct guesses, until only the answer remains", () => {
        const absurdle = new Absurdle();
        const total = absurdle.getRemainingWords();
        absurdle.tryGuess(VICTORY_GUESSES[0]);
        const first = absurdle.getRemainingWords();
        absurdle.tryGuess(VICTORY_GUESSES[1]);
        const second = absurdle.getRemainingWords();
        absurdle.tryGuess(VICTORY_GUESSES[2]);
        const third = absurdle.getRemainingWords();
        absurdle.tryGuess(VICTORY_GUESSES[3]);
        const fourth = absurdle.getRemainingWords();
        absurdle.tryGuess(VICTORY_GUESSES[4]);
        const fifth = absurdle.getRemainingWords();
        absurdle.tryGuess(VICTORY_GUESSES[5]);
        const sixth = absurdle.getRemainingWords();
        absurdle.tryGuess(VICTORY_GUESSES[6]);
        const seventh = absurdle.getRemainingWords();
        expect(first).toBeLessThan(total);
        expect(second).toBeLessThan(first);
        expect(third).toBeLessThan(second);
        expect(fourth).toBeLessThan(third);
        expect(fifth).toBeLessThan(fourth);
        expect(sixth).toBeLessThan(fifth);
        expect(seventh).toBeLessThanOrEqual(sixth);
        expect(seventh).toBe(1);
        expect(absurdle.wordBucket[0]).toBe(VICTORY_GUESSES[6]);
    });

    it("should generate the same game from a tally", () => {
        const absurdle = new Absurdle();
        absurdle.tryGuess("tests");
        absurdle.tryGuess("error");
        absurdle.tryGuess("aphid");
        const tally = absurdle.toTally();
        const newAbsurdle = Absurdle.fromTally(tally);
        expect(newAbsurdle.toTally()).toEqual(tally);
        expect(newAbsurdle.wordBucket).toEqual(absurdle.wordBucket);
    });
});