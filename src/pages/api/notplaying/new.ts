// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Game from "@/app/game/game";
import Database from "@/lib/database";
import type NextApiGameRequest from "@/utils/nextApiGameRequest";
import { NextApiResponse } from "next";
import Tally from "@/models/tally";
import Absurdle from "@/app/game/absurdle";

export default async function handler(req: NextApiGameRequest, res: NextApiResponse<Game>) {
    await Database.ensureConnection();

    let userToken = req.cookies?.token;
    if (!userToken) {
        userToken = generateToken();
        console.log(userToken);
        res.setHeader(`Set-Cookie`, `token=${userToken}; path=/;`);
    }
    // await Database.ensureConnection();
    const wordle = new Absurdle(false);
    console.log(wordle.toDatabaseTally(userToken));
    const game = await Tally.findOneAndReplace(
        { userToken },
        { ...wordle.toDatabaseTally(userToken) },
        { upsert: true },
    );
    game.save();
    res.status(200).json(game);
}

// Generates a 64 letters/numbers/symbols random string
function generateToken(): string {
    return Math.random().toString(36).substr(2, 64);
}
