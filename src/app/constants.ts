export enum GameMode {
    WORDLE = `wordle`,
    WORDLE_HARD = `wordle-hard`,
    ABSURDLE = `absurdle`,
    ABSURDLE_HARD = `absurdle-hard`,
    DAILY = `daily`,
}

export enum GameState {
    PLAYING = `playing`,
    WON = `won`,
    LOST = `lost`,
}

export enum LetterState {
    ABSENT = `absent`,
    PRESENT = `present`,
    CORRECT = `correct`,
    UNKNOWN = `unknown`,
}

export interface IHintLetter {
    letter: string;
    state: LetterState;
}

export const DEFAULT_LIVES = 6;
export const ABSURDLE_LIVES = 10;
