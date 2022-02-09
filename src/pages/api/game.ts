import Database from "@/lib/database";
import type NextApiGameRequest from "@/utils/nextApiGameRequest";
import { NextApiResponse } from "next";
import { saveNewPlayerAndGetToken, addNewGame, getOngoingGame } from "@/services/player";
import modeToNewGame from "@/utils/modeToNewGame";
import TallyReport from "@/app/game/tallyReport";

export default async function handler(req: NextApiGameRequest, res: NextApiResponse) {
    await Database.ensureConnection();

    let userToken = req.cookies?.token;
    if (!userToken) {
        userToken = await saveNewPlayerAndGetToken();
        res.setHeader(`Set-Cookie`, `token=${userToken}; HttpOnly; Path=/;`);
    }
    const tally = await getOngoingGame(userToken);
    if (tally) {
        const game = TallyReport.jsonToGame(tally);
        res.status(200).json(game.toUserJson());
    } else {
        const mode: string = req.query?.mode?.toString() || `wordle`; // TODO: Change to daily
        const game = modeToNewGame.get(mode)();
        await addNewGame(userToken, game.toDatabaseTally(userToken));
        res.status(200).json(game.toUserJson());
    }
}
