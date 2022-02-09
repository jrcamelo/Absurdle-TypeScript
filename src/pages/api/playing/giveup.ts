import Database from "@/lib/database";
import type NextApiGameRequest from "@/utils/nextApiGameRequest";
import { NextApiResponse } from "next";
import { quitOngoingGame } from "@/services/player";
import ApiMessage from "../../../utils/apiMessage";
import ApiError from "@/utils/apiError";

export default async function handler(req: NextApiGameRequest, res: NextApiResponse) {
    await Database.ensureConnection();
    const userToken = req.cookies.token;
    try {
        await quitOngoingGame(userToken);
        res.status(200).json(ApiMessage.successJson());
    } catch (error: any) {
        res.status(400).json(new ApiError(error.message, 400).toJson());
    }
}
