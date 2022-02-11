import Database from "@/lib/database";
import type NextApiGameRequest from "@/utils/nextApiGameRequest";
import { NextApiResponse } from "next";
import { getGame, makeGuessAndSave } from "@/services/games";
import errorHandler from '@/utils/errorHandler';

export default async function handler(req: NextApiGameRequest, res: NextApiResponse) {
    await Database.ensureConnection();
    try {
        const userToken = req.cookies.token;
        const game = await getGame(userToken);
        let guess = req.body || req.query.guess;
        if (guess?.length > 5) {
            guess = guess.substring(0, 5)
        }
        await makeGuessAndSave(userToken, game, guess);
        res.status(200).json(game.toUserJson());
    } catch (error: any) {
        return errorHandler(res, error, "Could not make guess", 500);
    }
}
