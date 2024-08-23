import nodemailer from "nodemailer";
import User from "@/models/user";
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        // configure mail for usage
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 });
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 })
        }

        console.log("Mailtrap User:", process.env.MAILTRAP_USER);
        console.log("Mailtrap Pass:", process.env.MAILTRAP_PASS);


        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS
            }
        });

        transport.verify((error, success) => {
            if (error) {
                console.log('Error in SMTP setup:', error);
            } else {
                console.log('SMTP setup is correct');
            }
        });

        const forgot = `<p>Click here <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}"> ${emailType === "FORGOT" ? "reset your password" : "verify your email"} </a>
        or copy and paste the link below into your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken} </p>`;

        const verify = `<p>Click here <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}"> ${emailType === "VERIFY" ? "verify your email" : "reset your password"} </a>
        or copy and paste the link below into your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken} </p>`;

        const mailOptions = {
            from: 'laiba@gmail.com', // sender address
            to: email, // list of receivers
            subject: emailType, // Subject line
            html: emailType === "VERIFY" ? verify : forgot, // html body
        };

        const mailResponse = await transport.sendMail(mailOptions)
        return mailResponse;

    } catch (error: any) {

        throw new Error(error.message);
    }
}