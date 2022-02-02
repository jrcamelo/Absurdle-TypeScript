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

    evaluateGuess(guess: string): IHintLetter[];
    updateStatusAndGuesses(result: IHintLetter[]): void;

    guessesToList(): string[];

    checkForWinOrLoss(result: IHintLetter[]): void;

    toTally(): Map<string, any>;
}
