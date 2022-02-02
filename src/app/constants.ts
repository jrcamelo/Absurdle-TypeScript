export const enum GameState {
    PLAYING = `playing`,
    WON = `won`,
    LOST = `lost`,
}

export const enum LetterState {
    ABSENT = `absent`,
    PRESENT = `present`,
    CORRECT = `correct`,
}

export interface IHintLetter {
    letter: string;
    state: LetterState;
}

export const DEFAULT_LIVES = 6;
export const ABSURDLE_LIVES = 10;
