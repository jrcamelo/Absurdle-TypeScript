import { LetterState } from "./constants";

export default class Status {
    public absentLetters: string[] = [];
    public presentLetters: string[] = [];
    public correctLetters: string[] = ["", "", "", "", ""];
    
    public constructor(previous?: Status) {
        if (previous) {
            this.absentLetters = previous.absentLetters;
            this.presentLetters = previous.presentLetters;
            this.correctLetters = previous.correctLetters;
        }
    }

    public update(evaluation: [string, LetterState][]) {
        for (let i = 0; i < 5; i++) {
            const [ letter, state ] = evaluation[i];
            if (state === LetterState.CORRECT) {
                this.correctLetters[i] = letter;
            } else if (state === LetterState.PRESENT) {
                this.presentLetters.push(letter);
            } else {
                this.absentLetters.push(letter);
            }
        }
    }

    static fromArray(previous: Array<string[]>): Status {
        const [ absentLetters, presentLetters, correctLetters ] = previous;
        const status = new Status();
        status.absentLetters = absentLetters;
        status.presentLetters = presentLetters;
        status.correctLetters = correctLetters;
        return status;
    }
}