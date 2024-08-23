import User from "@/models/user";
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connect();

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const { email, password } = reqBody;
        // user find kro
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "user does not exist" }, { status: 400 });
        }
        console.log("user verified for login / user exist");
        // password check kro
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ error: "password is incorrect" }, { status: 400 });
        }
        // if password is valid set token/cookie data
        const tokenData = { id: user._id }
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1d' });
        // response kya send krna , abhi sirf variable mai store kia
        const response = NextResponse.json({
            message: "LoggedIN",
            success: true
        })
        // cookie mai data set kr do
        response.cookies.set("token", token, {
            httpOnly: true
        });

        return response;

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}