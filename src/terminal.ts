import Wordle from './wordle';
import { GameState } from './constants';
export default class Terminal {
    private game: Wordle;
    stdin: NodeJS.Socket;

    constructor(game: Wordle) {
        this.game = game;
        console.log("WELCOME TO WORDLE!\n");
        this.turn();
    }

    turn(): void {
        const tally = this.game.toTally();
        console.log("\n\nYou have " + tally.get("tries") + " tries left.");
        console.log("Absent letters: " + tally.get("absentLetters").join(", "));
        console.log("Present letters: " + tally.get("presentLetters").join(", "));
        console.log("Correct letters: " + tally.get("correctLetters").map((c: string) => c === "" ? "_" : c).join(""));
        console.log("\n\n");
        console.log(this.game.guesses);
        this.getGuess();
    }

    getGuess(): void {
        console.log("Try a word with 5 characters:\n");
        this.readLine().then(guess => {
            try {
                this.game.tryGuess(guess);
                if (this.game.gameState === GameState.WON) {
                    console.log("You won!");
                } else if (this.game.gameState === GameState.LOST) {
                    console.log("You lost!");
                } else {
                    this.turn();
                }
            } catch (e) {
                console.log(e.message);
                this.getGuess();
            }
        });
    }

    async readLine(): Promise<string> {

        const readLine = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
    
        let answer = ""
        readLine.question("", (it: string) => { 
            answer = it
            readLine.close()
        })
        while (answer == "") { await this.delay(100)  }
    
        return(answer)    
    }

    async delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
    
}