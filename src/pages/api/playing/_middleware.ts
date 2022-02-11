import NextApiGameRequest from "@/utils/nextApiGameRequest";
import { NextResponse } from "next/server";
import ApiError from "@/utils/apiError";

export const middleware = async (req: NextApiGameRequest) => {
    if (!req.cookies?.token) {
        const error = new ApiError(`You lack a cookie token, please start a new game`).toJson();
        return NextResponse.json(error);
    }
    NextResponse.next();
};
