import { LetterState, IHintLetter } from './constants';

export default class Status {
    public absentLetters: Set<string> = new Set([]);
    public presentLetters: Set<string> = new Set([]);
    public correctLetters: string[] = ["", "", "", "", ""];
    
    public constructor(previous?: Status) {
        if (previous) {
            this.absentLetters = previous.absentLetters;
            this.presentLetters = previous.presentLetters;
            this.correctLetters = previous.correctLetters;
        }
    }

    public update(evaluation: IHintLetter[]) {
        for (let i = 0; i < 5; i++) {
            const { letter, state } = evaluation[i];
            if (state === LetterState.CORRECT) {
                if (this.presentLetters.has(letter)) {
                    this.presentLetters.delete(letter);
                }
                this.correctLetters[i] = letter;
            } else if (state === LetterState.PRESENT) {
                if (!this.correctLetters.includes(letter)) {
                    this.presentLetters.add(letter);
                }
            } else {
                this.absentLetters.add(letter);
            }
        }
    }

    static fromArray(previous: [Set<string>, Set<string>, string[]]): Status {
        const [ absentLetters, presentLetters, correctLetters ] = previous;
        const status = new Status();
        status.absentLetters = absentLetters;
        status.presentLetters = presentLetters;
        status.correctLetters = correctLetters;
        return status;
    }
}