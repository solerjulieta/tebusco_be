import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

async function sendEmail(emailData)
{
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    })

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'tebusco.arg@gmail.com',
        subject: emailData.subject,
        text: emailData.text,
        replyTo: emailData.from
    }

    return transporter.sendMail(mailOptions)
}

export{
    sendEmail
}