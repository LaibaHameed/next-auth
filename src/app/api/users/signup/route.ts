import User from "@/models/user";
import { connect } from "@/dbConfig/dbConfig";
import { sendEmail } from "@/utils/mailer";
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';

connect();

export async function POST(req:NextRequest) {
    try {
        // request mai se username, email, password extract kr lain gy
        const reqBody = await req.json();
        const {username, email, password } = reqBody;
        //todo: validation username, password (k password 6 chars ka hona chaye) etc 
        // console.log(reqBody);

        // email se find kro (User database) mai phly se is email py koi user toh register toh nhi
        const user = await User.findOne({email});
        if(user) {
            return NextResponse.json({error: "user already exists"}, {status:400});
        }

        // salt generation and password encryption
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // creating new field(user) in db
        const newUser = await new User({
            username,
            email,
            password : hashedPassword
        });

        const savedUser = await newUser.save();
        // console.log(savedUser);

        // send verification email (go to utils/mailer.ts)
        // email hm password reset krny k liye b bhej skty hain or verification k lie b signup k time py
        // is liye email type 2 rkhy hain 1.VERIFY, 2.RESET
        await sendEmail({email, emailType: "VERIFY", userId: savedUser._id});

        return NextResponse.json({
            message : "user successfully registered",
            success : true,
            savedUser
        })

    } catch (error:any) {
        return NextResponse.json({error : error.message}, {status : 500});
    }
}

// ye hm core backend mai kod write krty thy yaha automatically create ho jata hai folder structure k base py
// localhost:3000/api/users/signup