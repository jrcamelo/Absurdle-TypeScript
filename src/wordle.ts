import Dictionary from './dictionary';

export default class Wordle {
    public answer: string;
    public tries: number = 6;
    public gameState: string = "playing";
    public absentLetters: string[] = [];
    public presentLetters: string[] = [];
    public correctLetters: string[] = ["", "", "", "", ""];
    public guesses: Map<string, string>[] = [];

    private dictionary: Dictionary;

    constructor() {
        this.dictionary = Dictionary.getInstance();
        this.answer = this.dictionary.getRandomSecret();
        // TODO: Remove this log
        console.log(this.answer);
    }


}