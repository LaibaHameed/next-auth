import User from "@/models/user";
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from 'next/server';   
import { getDataFromToken } from "@/utils/getDataFromToken";

connect(); 

export async function POST(req : NextRequest) {
    try {
        // extract data from token (go to utils/getDataFromToken)
        const userId = await getDataFromToken(req);
        // password k elwa sara data de do
        const user = await User.findOne({_id: userId}).select("-password");
        // check if there is no user
        if(!user){
            return NextResponse.json({message : "user not found"});
        }
        return NextResponse.json({
            message : "user found",
            data : user
        });
    } catch (error) {
        
    }
}