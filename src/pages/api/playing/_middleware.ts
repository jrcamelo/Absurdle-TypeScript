import NextApiGameRequest from "@/utils/nextApiGameRequest";
import { NextResponse } from "next/server";
import ApiError from "@/utils/apiError";
import checkIfUuidV4IsValid from "@/utils/uuidChecker";

export const middleware = async (req: NextApiGameRequest) => {
    if (!req.cookies?.token) {
        const error = new ApiError(`You lack a cookie token, please start a new game`).toJson();
        return NextResponse.json(error);
    } else if (checkIfUuidV4IsValid(req.cookies.token) === false) {
        const error = new ApiError(`Your cookie token is not a valid uuid v4, please start a new game`).toJson();
        return NextResponse.json(error);
    }
    NextResponse.next();
};
