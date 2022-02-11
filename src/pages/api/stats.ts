import Database from "@/lib/database";
import type NextApiGameRequest from "@/utils/nextApiGameRequest";
import { NextApiResponse } from "next";
import ApiError from "../../utils/apiError";
import { getGlobalStats } from "@/services/globalDailyStats";

export default async function handler(req: NextApiGameRequest, res: NextApiResponse) {
    await Database.ensureConnection();

    let dayNumber: number | undefined = undefined;
    try {
        const dayNumberParam: string = req.query?.day?.toString();
        if (dayNumberParam) {
            dayNumber = parseInt(dayNumberParam);
        }
    } catch (e) {
        return res.status(400).json(new ApiError(`Invalid dayNumber`, 400));
    }

    return res.status(200).json(JSON.stringify(await getGlobalStats(dayNumber)));
}
