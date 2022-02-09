import { GameState, IHintLetter } from "../constants";
import Dictionary from "../dictionary";
import Status from "../status";

export default interface Game {
    answer: string;
    hardMode: boolean;

    tries: number;
    gameState: GameState;
    status: Status;
    guesses: IHintLetter[][];

    dictionary: Dictionary;

    tryGuess(guess: string): void;

    checkGameState(): void;
    checkValidGuess(guess: string): void;

    loadGuesses(guesses: string[][][]): void;

    evaluateGuess(guess: string): IHintLetter[];
    updateStatusAndGuesses(result: IHintLetter[]): void;

    getMode(): string;
    guessesToList(): string[];
    guessesToListOfGuesses(): string[][][];

    checkForWinOrLoss(result: IHintLetter[]): void;

    toTally(): any;
    toDatabaseTally(userToken: string): any;
    toUserJson(): any;
}
