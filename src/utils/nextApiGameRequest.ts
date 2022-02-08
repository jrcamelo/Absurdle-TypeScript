import type { NextApiRequest } from "next";
export default interface NextApiGameRequest extends NextApiRequest {
    token: string;
}
