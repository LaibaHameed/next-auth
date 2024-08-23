import nodemailer from "nodemailer";
import User from "@/models/user";
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        //* configure mail for usage

        // userId ko encrypt kr k token bana dia hai
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        // emailtype k mutabiq phir hm db mai se userId se user find kare gy
        //  or oski values populate kara dain gy
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                $set : { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 }
            });
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                $set: { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 }
            })
        }

        // ye nodemailer ka function hai , basically mailtrap py hmri emails transport hon gi
        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS
            }
        });

        const reset = `<p>Click here -> <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}"> ${emailType === "RESET" ? "reset your password" : "verify your email"} </a>
        or copy and paste the link below into your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken} </p>`;

        const verify = `<p>Click here <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}"> ${emailType === "VERIFY" ? "verify your email" : "reset your password"} </a>
        or copy and paste the link below into your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken} </p>`;

        const mailOptions = {
            from: 'laiba@gmail.com', // sender address
            to: email, // list of receivers
            subject: emailType, // Subject line
            html: emailType === "VERIFY" ? verify : reset, // html body
        };

        const mailResponse = await transport.sendMail(mailOptions)
        return mailResponse;

    } catch (error: any) {

        throw new Error(error.message);
    }
}