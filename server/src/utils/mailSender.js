// Here we are fabricating mail sending capability for login Authentication by nodemailer

// imports
import nodemailer from "nodemailer"


// literals



// defined




// main
export default sendEmail













/*

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const info = await transporter.sendMail({
            from: `"Chai Backend" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html
        });

        return info;
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw error;
    }
};

*/


