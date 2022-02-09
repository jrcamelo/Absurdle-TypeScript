import Database from "@/lib/database";
import type NextApiGameRequest from "@/utils/nextApiGameRequest";
import { NextApiResponse } from "next";
import { getOngoingGame } from "@/services/player";
import ApiError from "@/utils/apiError";
import Game from '../../../app/game/game';
import { getGame, makeAndSaveGuess } from "@/services/game";
import GameError from '@/utils/gameError';

export default async function handler(req: NextApiGameRequest, res: NextApiResponse) {
    await Database.ensureConnection();
    try {
        const userToken = req.cookies.token;
        const game = await getGame(userToken);
        let guess = req.body || req.query.guess;
        if (guess?.length > 5) {
            guess = guess.substring(0, 5)
        }
        await makeAndSaveGuess(userToken, game, guess);
        res.status(200).json(game.toUserJson());



    } catch (error: any) {
        if (error instanceof ApiError) {
            res.status(500).json(new ApiError(error.message, 500).toJson());
        } else if (error instanceof GameError) {
            res.status(400).json(new GameError(error.message, 400).toJson());
        } else {
            // res.status(500).json(new ApiError("Error", 500).toJson());
            // TODO: Change this
            res.status(500).json(new ApiError(error.message, 400).toJson());
        }
    }
}
