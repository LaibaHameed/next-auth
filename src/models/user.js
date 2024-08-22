import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : [true , "please enter username"],
        unique : [true , "username already exists"]
    },
    email : {
        type : String,
        required : [true , "please enter email"],
        unique : [true , "email already exists"]
    },
    password : {
        type : String,
        required : [true , "please enter password"],
    },
    isVerified : {
        type: Boolean,
        default : false
    },
    isAdmin : {
        type: Boolean,
        default : false
    },
    forgotPasswordToken : String,
    forgotPasswordTokenExpiry : Date,
    verifyToken : String,
    verifyTokenExpiry : Date
})

//        users model find    if not find    create model
const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
