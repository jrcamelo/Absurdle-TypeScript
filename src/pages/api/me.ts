import Database from "@/lib/database";
import type NextApiGameRequest from "@/utils/nextApiGameRequest";
import { NextApiResponse } from "next";
import { saveNewPlayerAndGetToken, getPlayerStats } from "@/services/players";

import ApiError from "../../utils/apiError";
import setToken from "@/utils/cookieSetter";

export default async function handler(req: NextApiGameRequest, res: NextApiResponse) {
    await Database.ensureConnection();

    let userToken = req.cookies?.token;
    if (!userToken) {
        userToken = await saveNewPlayerAndGetToken();
        setToken(res, userToken);
    }
    try {
        const stats = await getPlayerStats(userToken);
        res.status(200).json(stats.toJson());
    } catch (e) {
        console.log(e);
        return res.status(500).json(new ApiError(`Could not get player stats`, 500));
    }
}
