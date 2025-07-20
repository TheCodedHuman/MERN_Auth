// Here we are fabricating mail sending capability for login Authentication by nodemailer

// imports
import nodemailer from "nodemailer"


// literals
const sendEmail = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})


// main
export default sendEmail

