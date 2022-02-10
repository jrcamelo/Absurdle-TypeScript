import Wordle from '@/app/game/wordle';
import Absurdle from '@/app/game/absurdle';
import Game from '@/app/game/game';
import { finishGame, getOngoingGame, updateOngoingGame } from '@/services/players';
import { GameState } from '@/app/constants';
import modeToFromJson from '../utils/modeToFromJson';


export async function getGame(userToken: string): Promise<Game | Wordle | Absurdle> {
    const gameObject = await getOngoingGame(userToken);
    if (!gameObject) throw new Error(`No ongoing game`);
    return modeToFromJson(gameObject.mode, gameObject);
}

export async function makeAndSaveGuess(userToken: string, game: Game, guess: string) {
    game.tryGuess(guess);
    if (game.gameState == GameState.PLAYING) {
        await updateOngoingGame(userToken, game.toDatabaseTally(userToken));
    } else {
        await finishGame(userToken, game.toDatabaseTally(userToken));
    }
}
