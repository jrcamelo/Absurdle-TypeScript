import type { NextApiRequest } from "next";
import Game from "@/app/game/game";
import Database from "@/lib/database";

export default interface NextApiGameRequest extends NextApiRequest {
    db: Database;
    token?: string;
    game?: Game;
}
