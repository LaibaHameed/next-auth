import { log } from "console";
import mongoose from "mongoose";

// db hmesha dosre continent mai hota hai toh is ki koi grutee nahi k connect ho ga ya nahi,
// toh is liye try catch lgana pare ga, or db dosre continent mai hai yani time lgy ga toh async await lgana pare ga

export  async function connect(){
    try {
        let uri = process.env.MONGO_URI;
        if(uri) {
            mongoose.connect(uri);
        }else{
            mongoose.connect("");
        }
        // ypu can use instead 
        // mongoose.connect(process.env.MONGO_URI!)

        const connection = mongoose.connection;
        connection.on('connection', ()=>{
            console.log("MongoDB connected");
        });
        connection.on('error', (error)=>{
            console.log("mongoDB connection error, makie sure db is up and running" + error);
            process.exit();
        })
    } catch (error) {
        console.log("something went wrong in connecting db");
        console.log(error);
    }
}