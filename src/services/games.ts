import Wordle from "@/app/game/wordle";
import Absurdle from "@/app/game/absurdle";
import Game from "@/app/game/game";
import { finishGame, getOngoingGame, updateOngoingGame } from "@/services/players";
import { GameState } from "@/app/constants";
import modeToFromJson from "../utils/modeToFromJson";
import ApiError from "../utils/apiError";

export async function getGame(userToken: string): Promise<Game | Wordle | Absurdle> {
    const gameObject = await getOngoingGame(userToken);
    if (!gameObject) throw new ApiError(`No ongoing game`, 400);
    return modeToFromJson(gameObject.mode, gameObject);
}

export async function makeGuessAndSave(userToken: string, game: Game, guess: string) {
    game.tryGuess(guess);
    if (game.gameState == GameState.PLAYING) {
        await updateOngoingGame(userToken, game.toDatabaseTally(userToken));
    } else {
        await finishGame(userToken, game.toDatabaseTally(userToken));
    }
}

export async function makeRandomGuessAndSave(userToken: string, game: Game) {
    return await makeGuessAndSave(userToken, game, game.getRandomGuess());
}
