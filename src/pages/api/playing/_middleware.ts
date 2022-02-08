import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import GameException from '../../../app/game/gameException';

export const middleware = async (req: NextApiRequest) => {
    if (!req.cookies?.token) {
        const error = new GameException(`You lack a cookie token, please start a new game`).toJson();
        return NextResponse.json(error);
    }
};
