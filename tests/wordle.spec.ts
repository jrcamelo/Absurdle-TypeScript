import Wordle from '../src/wordle';
import Dictionary from '../src/dictionary';

describe("Wordle", () => {
  it("should start with an answer from the dictionary", () => {
    const wordle = new Wordle();
    const secrets = Dictionary.getInstance().getSecrets();
    expect(secrets).toContain(wordle.answer);
  });

  it("should start with 6 tries", () => {
    const wordle = new Wordle();
    expect(wordle.tries).toBe(6);
  });

  it("should start with a 'playing' game state", () => {
    const wordle = new Wordle();
    expect(wordle.gameState).toBe("playing");
  });

  it("should start with an empty list of absent letters", () => {
    const wordle = new Wordle();
    expect(wordle.absentLetters.length).toBe(0);
  });

  it("should start with an empty list of present letters", () => {
    const wordle = new Wordle();
    expect(wordle.presentLetters.length).toBe(0);
  });
  
  it("should start with 5 empty correct letters", () => {
    const wordle = new Wordle();
    expect(wordle.correctLetters.length).toBe(5);
    expect(wordle.correctLetters.filter(letter => letter.length > 0).length).toBe(0);
  });

  it("should start with an empty list of guesses", () => {
    const wordle = new Wordle();
    expect(wordle.guesses.length).toBe(0);
  });
  
  it("should have a 'victory' game state if the answer is guessed", () => {
    const wordle = new Wordle();
    wordle.answer = "tests";
    wordle.guess("tests");
    expect(wordle.gameState).toBe("victory");
  });

  it("should lose a try if the answer is not guessed", () => {
    const wordle = new Wordle();
    wordle.answer = "fails";
    wordle.guess("tests");
    expect(wordle.tries).toBe(5);
  });

  it("should have a 'defeat' game state if the tries are exhausted", () => {
    const wordle = new Wordle();
    wordle.tries = 1;
    wordle.answer = "fails";
    wordle.guess("tests");
    expect(wordle.gameState).toBe("defeat");
  });
});