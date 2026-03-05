const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testMail() {
    try {
        console.log("Testing with User:", process.env.EMAIL_USER);
        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Test Brevo',
            text: 'It works!'
        });

        console.log("Success:", info.messageId);
    } catch (e) {
        console.error("Error connecting to Brevo:", e.message);
    }
}

testMail();
