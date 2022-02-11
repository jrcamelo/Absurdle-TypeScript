import Database from "@/lib/database";
import type NextApiGameRequest from "@/utils/nextApiGameRequest";
import { NextApiResponse } from "next";
import ApiError from "@/utils/apiError";
import { getGame } from "@/services/games";

export default async function handler(req: NextApiGameRequest, res: NextApiResponse) {
    await Database.ensureConnection();
    try {
        const game = await getGame(req.cookies.token);
        res.status(200).json(game.toUserJson());
    } catch (error: any) {
        res.status(400).json(new ApiError(error.message, 400).toJson());
    }
}
