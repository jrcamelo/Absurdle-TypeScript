import Database from "@/lib/database";
import type NextApiGameRequest from "@/utils/nextApiGameRequest";
import { NextApiResponse } from "next";
import { getGame, makeRandomGuessAndSave } from "@/services/games";
import errorHandler from "@/utils/errorHandler";

export default async function handler(req: NextApiGameRequest, res: NextApiResponse) {
    await Database.ensureConnection();
    try {
        const userToken = req.cookies.token;
        const gameJson = await getGame(userToken);
        await makeRandomGuessAndSave(userToken, gameJson);
        res.status(200).json(gameJson.toUserJson());
    } catch (error: any) {
        return errorHandler(res, error, `Could not make guess`, 500);
    }
}
