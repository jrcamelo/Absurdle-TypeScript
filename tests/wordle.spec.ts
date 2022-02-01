import Wordle from '../src/wordle';
import Dictionary from '../src/dictionary';
import { GameState, DEFAULT_LIVES } from '../src/constants';
import Evaluator from '../src/evaluator';

const TALLY: Map<string, any> = new Map<string, any>([
  ["gameState", GameState.PLAYING],
  ["tries", DEFAULT_LIVES - 2],
  ["hardMode", false],
  ["guesses", [
    [
      { letter: 'f', state: 'absent' },
      { letter: 'a', state: 'absent' },
      { letter: 'i', state: 'absent' },
      { letter: 'l', state: 'absent' },
      { letter: 's', state: 'correct' },
    ],
    [
      { letter: 'e', state: 'present' },
      { letter: 'r', state: 'absent' },
      { letter: 'r', state: 'absent' },
      { letter: 'o', state: 'absent' },
      { letter: 'r', state: 'absent' }
    ]
  ],],
  ["absentLetters", [ 'f', 'a', 'i', 'l', 'r', 'o' ]],
  ["presentLetters", [ 'e' ]],
  ["correctLetters", [ '', '', '', '', 's' ]],
  ["answer", ""]
]);

const TALLY_LOST: Map<string, any> = new Map<string, any>(TALLY);
TALLY_LOST.set("gameState", GameState.LOST);
TALLY_LOST.set("tries", 0);
TALLY_LOST.set("correctLetters", [ 't', 'e', 's', 't', 's' ]);
TALLY_LOST.set("answer", "tests");

const TALLY_WON: Map<string, any> = new Map<string, any>(TALLY_LOST);
TALLY_WON.set("gameState", GameState.WON);
TALLY_WON.set("tries", DEFAULT_LIVES - 2);
TALLY_WON.set("presentLetters", []);
TALLY_WON.set("guesses", [ ...TALLY_LOST.get("guesses"), [
    { letter: 't', state: 'correct' },
    { letter: 'e', state: 'correct' },
    { letter: 's', state: 'correct' },
    { letter: 't', state: 'correct' },
    { letter: 's', state: 'correct' }
]]);

describe("Wordle", () => {
  it("should start with an answer from the dictionary", () => {
    const wordle = new Wordle();
    const secrets = Dictionary.getInstance().getSecrets();
    expect(secrets).toContain(wordle.answer);
  });

  it("should start with default amount of tries", () => {
    const wordle = new Wordle();
    expect(wordle.tries).toBe(DEFAULT_LIVES);
  });

  it("should start with a 'playing' game state", () => {
    const wordle = new Wordle();
    expect(wordle.gameState).toBe("playing");
  });

  it("should start with an empty set of absent letters", () => {
    const wordle = new Wordle();
    expect(wordle.status.absentLetters).toEqual(new Set());
  });

  it("should start with an empty set of present letters", () => {
    const wordle = new Wordle();
    expect(wordle.status.presentLetters).toEqual(new Set());
  });
  
  it("should start with 5 empty correct letters", () => {
    const wordle = new Wordle();
    expect(wordle.status.correctLetters.length).toBe(5);
    expect(wordle.status.correctLetters.filter((letter: string) => letter.length > 0).length).toBe(0);
  });

  it("should start with an empty list of guesses", () => {
    const wordle = new Wordle();
    expect(wordle.guesses.length).toBe(0);
  });
  
  it("should lose a try if the answer is not guessed", () => {
    const wordle = new Wordle();
    wordle.answer = "fails";
    wordle.tryGuess("tests");
    expect(wordle.tries).toBe(DEFAULT_LIVES - 1);
  });

  it("should have a 'lost' game state if the tries are exhausted", () => {
    const wordle = new Wordle();
    wordle.tries = 1;
    wordle.answer = "fails";
    wordle.tryGuess("tests");
    expect(wordle.gameState).toBe(GameState.LOST);
  });

  it("should have a 'playing' game state if the answer is not guessed and the tries are not exhausted", () => {
    const wordle = new Wordle();
    wordle.answer = "tests";
    wordle.tryGuess("fails");
    expect(wordle.gameState).toBe(GameState.PLAYING);
  });

  it("should have a 'won' game state if the answer is guessed", () => {
    const wordle = new Wordle();
    wordle.answer = "tests";
    wordle.tryGuess("tests");
    expect(wordle.gameState).toBe(GameState.WON);
  });

  it("should throw an error if a guess is made when the game is not 'playing'", () => {
    const wordle = new Wordle();
    wordle.gameState = GameState.WON;
    expect(() => wordle.tryGuess("tests")).toThrow();
    wordle.gameState = GameState.LOST;
    expect(() => wordle.tryGuess("tests")).toThrow();
  });

  it("should have the same answer even after a guess", () => {
    const wordle = new Wordle();
    wordle.answer = "tests";
    wordle.tryGuess("fails");
    expect(wordle.answer).toBe("tests");
  });

  it("should add guess status to guesses", () => {
    const wordle = new Wordle();
    wordle.answer = "tests";
    wordle.tryGuess("fails");
    const fails = Evaluator.evaluateGuess("tests", "fails");
    expect(wordle.guesses[0]).toEqual(fails);
    wordle.tryGuess("again");
    const again = Evaluator.evaluateGuess("tests", "again");
    expect(wordle.guesses).toEqual([fails, again]);
  });

  it("should have a hard mode", () => {
    const wordle = new Wordle();
    expect(wordle.hardMode).toBe(false);
    const hard = new Wordle(true);
    expect(hard.hardMode).toBe(true);
  });

  it("should throw an error on hard mode when you try the same absent letter twice", () => {
    const wordle = new Wordle(true);
    wordle.answer = "tests";
    wordle.tryGuess("first"); // R
    expect(() => wordle.tryGuess("error")).toThrow();
  });
  
  it("should throw an error on hard mode when you don't use a present letter", () => {
    const wordle = new Wordle(true);
    wordle.answer = "aphid";
    wordle.tryGuess("fails");
    expect(() => wordle.tryGuess("tests")).toThrow();
  });

  it("should throw an error on hard mode when you don't use a correct letter in the correct place", () => {
    const wordle = new Wordle(true);
    wordle.answer = "tests";
    wordle.tryGuess("pests");
    expect(() => wordle.tryGuess("error")).toThrow();
    expect(() => wordle.tryGuess("pasts")).toThrow();
  });

  it("should generate a tally", () => {
    const wordle = new Wordle();
    wordle.answer = "tests";
    wordle.tryGuess("fails");
    wordle.tryGuess("error");
    expect(wordle.toTally()).toEqual(TALLY);
  });

  it("should generate a different tally for victory", () => {
    const wordle = new Wordle();
    wordle.answer = "tests";
    wordle.tryGuess("fails");
    wordle.tryGuess("error");
    wordle.tryGuess("tests");
    expect(wordle.toTally()).toEqual(TALLY_WON);
  });

  it("should generate a different tally for defeat", () => {
    const wordle = new Wordle();
    wordle.answer = "tests";
    wordle.tryGuess("fails");
    wordle.tries = 1;
    wordle.tryGuess("error");
    expect(wordle.toTally()).toEqual(TALLY_LOST);
  });

  it("should generate a game from a tally", () => {
    const wordle = Wordle.fromTally(TALLY);
    expect(wordle.toTally()).toEqual(TALLY);
    wordle.answer = "tests";
    wordle.tryGuess("tests");
    expect(wordle.toTally()).toEqual(TALLY_WON);
  });
});