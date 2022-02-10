import { GameState } from "../constants";
import Absurdle from "./absurdle";
import Daily from "./daily";
import Wordle from "./wordle";

export default class TallyReport {
    mode: string;
    gameState: string;
    tries: number;
    hardMode: boolean;
    guesses: string[][][];
    absentLetters: Array<string>;
    presentLetters: Array<string>;
    correctLetters: Array<string>;
    answer: string;
    remainingWords = -1;

    constructor(
        mode: string,
        gameState: string,
        tries: number,
        hardMode: boolean,
        guesses: string[][][],
        absentLetters: Array<string>,
        presentLetters: Array<string>,
        correctLetters: Array<string>,
        answer: string,
        remainingWords = -1,
    ) {
        this.mode = mode;
        this.gameState = gameState;
        this.tries = tries;
        this.hardMode = hardMode;
        this.guesses = guesses;
        this.absentLetters = absentLetters;
        this.presentLetters = presentLetters;
        this.correctLetters = correctLetters;
        this.answer = answer;
        this.remainingWords = remainingWords;
    }

    static fromWordle(game: Wordle): TallyReport {
        return new TallyReport(
            game.getMode(),
            game.gameState,
            game.tries,
            game.hardMode,
            game.guessesToListOfGuesses(),
            Array.from(game.status.absentLetters),
            Array.from(game.status.presentLetters),
            game.status.correctLetters,
            game.answer,
        );
    }

    static fromAbsurdle(game: Absurdle): TallyReport {
        return new TallyReport(
            game.getMode(),
            game.gameState,
            game.tries,
            game.hardMode,
            game.guessesToListOfGuesses(),
            Array.from(game.status.absentLetters),
            Array.from(game.status.presentLetters),
            game.status.correctLetters,
            game.answer,
            game.getRemainingWords(),
        );
    }
    
    static fromDaily(game: Daily): TallyReport {
        return new TallyReport(
            game.getMode(),
            game.gameState,
            game.tries,
            game.hardMode,
            game.guessesToListOfGuesses(),
            Array.from(game.status.absentLetters),
            Array.from(game.status.presentLetters),
            game.status.correctLetters,
            game.answer,
        );
    }

    static fromJson(json: any): TallyReport {
        return new TallyReport(
            json.mode,
            json.gameState,
            json.tries,
            json.hardMode,
            json.guesses,
            json.absentLetters,
            json.presentLetters,
            json.correctLetters,
            json.answer,
            json.remainingWords,
        );
    }

    toJson() {
        return {
            mode: this.mode,
            gameState: this.gameState,
            tries: this.tries,
            hardMode: this.hardMode,
            guesses: this.guesses,
            absentLetters: this.absentLetters,
            presentLetters: this.presentLetters,
            correctLetters: this.correctLetters,
            answer: this.answer,
            remainingWords: this.remainingWords,
        };
    }

    toMap() {
        const map = new Map<string, any>();
        map.set(`mode`, this.mode);
        map.set(`gameState`, this.gameState);
        map.set(`tries`, this.tries);
        map.set(`hardMode`, this.hardMode);
        map.set(`guesses`, this.guesses);
        map.set(`absentLetters`, this.absentLetters);
        map.set(`presentLetters`, this.presentLetters);
        map.set(`correctLetters`, this.correctLetters);
        map.set(`answer`, this.answer);
        map.set(`remainingWords`, this.remainingWords);
        return map;
    }

    toDatabaseJson(userToken: string) {
        return { ...this.toJson(), userToken };
    }

    toUserJson(code? : string) {
        const answer = this.gameState == GameState.PLAYING.toString() ? `` : this.answer;
        return {
            mode: this.mode,
            gameState: this.gameState,
            tries: this.tries,
            hardMode: this.hardMode,
            guesses: this.guesses,
            absentLetters: this.absentLetters,
            presentLetters: this.presentLetters,
            correctLetters: this.correctLetters,
            remainingWords: this.remainingWords,
            answer,
            code,
        };
    }
}
