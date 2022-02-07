// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Game from "@/app/game/game";
import Database from "@/lib/database";
import type NextApiGameRequest from "@/utils/nextApiGameRequest";
import { NextApiResponse } from "next";
import Tally from "@/models/tally";

export default async function handler(req: NextApiGameRequest, res: NextApiResponse) {
    await Database.ensureConnection();

    const token = req.cookies?.token;
    const game = await Tally.findOne({ token });
    res.status(200).json(game);
}
