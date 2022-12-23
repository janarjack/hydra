const nodemailer = require("nodemailer");
const path = require("path");

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'gericke.psam@gmail.com',
                pass: 'vatylpzkqlqfelvo',
            },
        });

        await transporter.sendMail({
            from: 'gericke.psam@gmail.com',
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

const sendEmailAttchment = async (email, filename, filepath, text, subject) => {
    try {
        const transporter = nodemailer.createTransport({
             host: 'smtp.gmail.com',
             port: 465,
             secure: true,
            auth: {
                user: 'gericke.psam@gmail.com',
                pass: 'vatylpzkqlqfelvo',
            },
        });

        await transporter.sendMail({
            from: 'gericke.psam@gmail.com',
            to: email,
            subject: subject,
            text: text,
            attachments: [
                {   // utf-8 string as an attachment
                    filename: filename,
                    path: filepath,
                }]
        });

        console.log("email with attachment sent sucessfully");
    } catch (error) {
        console.log(error, "email with attachment not sent");
    }
};


module.exports = { sendEmail, sendEmailAttchment };
