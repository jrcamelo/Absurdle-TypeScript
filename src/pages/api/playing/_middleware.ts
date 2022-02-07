import NextApiGameRequest from "@/utils/nextApiGameRequest";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import Database from "@/lib/database";
// import Tally from "@/models/tally";

export const middleware = async (req: NextApiRequest) => {
    // Get token from cookies
    const token = req.cookies?.token;
    if (!token) {
        return NextResponse.json(NO_COOKIE_RESPONSE);
    }
};

const NO_COOKIE_RESPONSE = {
    statusCode: 401,
    body: JSON.stringify({
        error: `You lack a cookie token, please start a new game`,
    }),
};
