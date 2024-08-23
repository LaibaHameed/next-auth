import User from "@/models/user";
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(req : NextRequest) {
    try {

        // request body mai token aye ga
        const reqBody = await req.json();
        const {token} = reqBody;

        // if token is present then check is there any token in db, and its expiry date is greater ?
        // now time is 05:08pm and token expiry date/time is 8:00pm 
        const user = await User.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}});

        if(!user){
            return NextResponse.json({error : "invalid Token"},{status: 400});
        }
        console.log(user);

        // update values in db 
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({
            message : "Email verified successfully",
            success : true,
        }, {status: 500});


    } catch (error: any) {
        return NextResponse.json({error : error.message},{status: 500});
    }
}