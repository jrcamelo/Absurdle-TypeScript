// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Database from "@/lib/database";
import type NextApiGameRequest from "@/utils/nextApiGameRequest";
import { NextApiResponse } from "next";
import { getOngoingGame } from "@/services/player";

export default async function handler(req: NextApiGameRequest, res: NextApiResponse) {
    await Database.ensureConnection();
    const userToken = req.cookies?.token;
    console.log(`token: ${userToken}`);
    const game = await getOngoingGame(userToken);
    console.log(game)
    res.status(200).json(game || "");
}
