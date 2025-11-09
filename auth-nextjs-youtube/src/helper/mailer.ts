// domain.com/verifytoken/assasasdfdffg  // user server 
// domain.com/verifytoken?token=adfasf   //  user client

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { verify } from 'crypto';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        // create a hashed token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 }
                //  {new: true, runValidators: true}
            );
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 }
                //  {new: true, runValidators: true}
            );
        }

        // Looking to send emails in production? Check out our Email API/SMTP product!
        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER!,
                pass: process.env.MAILTRAP_PASS!
            }
        });

        const mailOptions = {
            from: 'aadityayadav7656@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: emailType === "VERIFY" ? 
                `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to verify your email
                or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
                </p>` :
                `<p>Click <a href="${process.env.DOMAIN}/resetpassword?token=${hashedToken}">here</a> to reset your password
                or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/resetpassword?token=${hashedToken}
                </p>`
        };

        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error.message)
    }
}

