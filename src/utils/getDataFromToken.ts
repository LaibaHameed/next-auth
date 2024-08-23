import { NextRequest } from "next/server";
import Jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
    try {

        const token = request.cookies.get("token")?.value || "";
        const decodedToken: any = Jwt.verify(token, process.env.TOKEN_SECRET!);

        // sirf id is liye lagai instead of _id kiu k hm ne login route mai token id k name se send kia tha
        return decodedToken.id;

    } catch (error: any) {
        throw new Error(error.message);
    }
}