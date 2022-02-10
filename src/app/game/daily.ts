import { DEFAULT_LIVES, GameMode } from '../constants';
import Status from '../status';
import TallyReport from './tallyReport';
import Wordle from './wordle';

export default class Daily extends Wordle {
    constructor(tries: number = DEFAULT_LIVES, date?: Date) {
        super(false, undefined, tries);
        if (!date) {
            this.answer = this.dictionary.getTodaysSecret();
        } else {
            this.answer = this.dictionary.getDailySecret(date);
        }
    }

    public static fromJson(json: any): Daily {
        const game = new Daily(json[`tries`] || 0);
        game.gameState = json[`gameState`];
        game.status = new Status(undefined, json);
        game.loadGuesses(json[`guesses`]);
        game.answer = json[`answer`];
        return game;
    }

    public getMode(): string {
        return GameMode.DAILY;
    }

    public toUserJson() {
        return TallyReport.fromDaily(this).toUserJson();
    }
}