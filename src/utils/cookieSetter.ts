import { NextApiResponse } from "next";

export default function setToken(res: NextApiResponse, userToken: string) {
    res.setHeader("Set-Cookie", `token=${userToken}; Path=/; HttpOnly; Secure;`);
}