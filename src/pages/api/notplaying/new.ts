// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Game from "@/app/game/game";
import Database from "@/lib/database";
import type NextApiGameRequest from "@/utils/nextApiGameRequest";
import { NextApiResponse } from "next";
import { getPlayer, saveNewPlayerAndGetToken, addNewGame, quitOngoingGame } from "@/services/player";
import Absurdle from "@/app/game/absurdle";

export default async function handler(req: NextApiGameRequest, res: NextApiResponse) {
    await Database.ensureConnection();

    let userToken = req.cookies?.token;
    let player = await getPlayer(userToken);
    if (!userToken || !player) {
        userToken = await saveNewPlayerAndGetToken();
        res.setHeader("Set-Cookie", `token=${userToken}; HttpOnly; Path=/;`);
        player = await getPlayer(userToken);
    }

    const wordle = new Absurdle(false);
    console.log(wordle.toDatabaseTally(userToken));
    await addNewGame(userToken, wordle.toDatabaseTally(userToken));
    res.status(200).json(wordle.toUserJson());
}