import { NextApiResponse } from "next";
import ApiError from "./apiError";
import GameError from "@/utils/gameError";

export default function handleError(res: NextApiResponse, error: any, defaultMessage: string, defaultCode: number) {
    if (error instanceof ApiError || error instanceof GameError) {
        return res.status(error.statusCode).json(error.toJson());
    } else {
        console.log(error);
        return res.status(defaultCode).json(defaultMessage);
    }
}
