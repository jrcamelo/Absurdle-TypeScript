import Absurdle from '../src/absurdle';
import Dictionary from '../src/dictionary';
import { GameState, ABSURDLE_LIVES } from '../src/constants';
import Evaluator from '../src/evaluator';

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
        absurdle.tryGuess("wrung");
        absurdle.tryGuess("aphid");
        absurdle.tryGuess("fable");
        absurdle.tryGuess("tacky");
        absurdle.tryGuess("sassy");
        absurdle.tryGuess("jazzy");
        absurdle.tryGuess("savvy");
        expect(absurdle.gameState).toBe(GameState.WON);
    });

    it("should decrease the amount of remaining words as player makes correct guesses, until only the answer remains", () => {
        const absurdle = new Absurdle();
        const total = absurdle.getRemainingWords();
        absurdle.tryGuess("wrung");
        const first = absurdle.getRemainingWords();
        absurdle.tryGuess("aphid");
        const second = absurdle.getRemainingWords();
        absurdle.tryGuess("fable");
        const third = absurdle.getRemainingWords();
        absurdle.tryGuess("tacky");
        const fourth = absurdle.getRemainingWords();
        absurdle.tryGuess("sassy");
        const fifth = absurdle.getRemainingWords();
        absurdle.tryGuess("jazzy");
        const sixth = absurdle.getRemainingWords();
        absurdle.tryGuess("savvy");
        const seventh = absurdle.getRemainingWords();
        expect(first).toBeLessThan(total);
        expect(second).toBeLessThan(first);
        expect(third).toBeLessThan(second);
        expect(fourth).toBeLessThan(third);
        expect(fifth).toBeLessThan(fourth);
        expect(sixth).toBeLessThanOrEqual(fifth);
        expect(seventh).toBeLessThan(sixth);
        expect(seventh).toBe(1);
        expect(absurdle.wordBucket[0]).toBe("savvy");
    });
});