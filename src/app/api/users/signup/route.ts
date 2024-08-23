import User from "@/models/user";
import { connect } from "@/dbConfig/dbConfig";
import { sendEmail } from "@/utils/mailer";
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';

connect();

export async function POST(req:NextRequest) {
    try {
        const reqBody = await req.json();
        const {username, email, password } = reqBody;
        // validation username, password (k password 6 chars ka hona chaye) etc 
        console.log(reqBody);

        const user = await User.findOne({email});
        if(user) {
            return NextResponse.json({error: "user already exists"}, {status:400});
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const newUser = await new User({
            username,
            email,
            password : hashedPassword
        });

        const savedUser = await newUser.save();
        console.log(savedUser);

        // send verification email
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