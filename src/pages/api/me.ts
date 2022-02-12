import Database from "@/lib/database";
import type NextApiGameRequest from "@/utils/nextApiGameRequest";
import { NextApiResponse } from "next";
import { saveNewPlayerAndGetToken, getPlayerStats } from "@/services/players";
import ApiError from "../../utils/apiError";
import setToken from "@/utils/cookieSetter";
import checkIfUuidV4IsValid from "@/utils/uuidChecker";

export default async function handler(req: NextApiGameRequest, res: NextApiResponse) {
    await Database.ensureConnection();

    let userToken = req.cookies?.token;
    if (!userToken) {
        userToken = await saveNewPlayerAndGetToken();
        setToken(res, userToken);
    } else {
        if (checkIfUuidV4IsValid(userToken) === false) {
            const error = new ApiError(`Your cookie token is not a valid uuid v4, please start a new game`).toJson();
            return res.status(400).json(error);
        }
    }
    try {
        const stats = await getPlayerStats(userToken);
        res.status(200).json(stats.toJson());
    } catch (e) {
        console.log(e);
        return res.status(500).json(new ApiError(`Could not get player stats`, 500));
    }
}
