import Database from "@/lib/database";
import type NextApiGameRequest from "@/utils/nextApiGameRequest";
import { NextApiResponse } from "next";
import { saveNewPlayerAndGetToken, addNewGame, getOngoingGame } from "@/services/players";
import modeToNewGame from "@/utils/modeToNewGame";
import modeToFromJson from "../../utils/modeToFromJson";
import errorHandler from "@/utils/errorHandler";

export default async function handler(req: NextApiGameRequest, res: NextApiResponse) {
    await Database.ensureConnection();

    let userToken = req.cookies?.token;
    if (!userToken) {
        userToken = await saveNewPlayerAndGetToken();
        res.setHeader(`Set-Cookie`, `token=${userToken}; HttpOnly; Path=/;`);
    }
    const tally = await getOngoingGame(userToken);
    if (tally) {
        const game = modeToFromJson(tally.mode, tally);
        res.status(200).json(game.toUserJson());
    } else {
        const code: string = req.query?.code?.toString();
        let mode: string = req.query?.mode?.toString();
        if (!mode) {
            mode = code != null ? `wordle` : `daily`;
        }
        console.log(`code: ${code} and mode: ${mode}`);
        const game = modeToNewGame(mode, code);
        try {
            await addNewGame(userToken, game.toDatabaseTally(userToken));
            return res.status(200).json(game.toUserJson());
        } catch (error) {
            return errorHandler(res, error, `Could not create new game`, 500);
        }
    }
}
