import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const data = await req.json();

        const { name, company, email, phone, message } = data;

        if (!name || !company || !email || !phone) {
            return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
        }

        // Pour configurer cet envoi, il faut ajouter EMAIL_USER et EMAIL_PASS dans .env.local
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // EMAIL_TO définit l'adresse de réception. Sinon on utilise ninoprime@hotmail.com pour les tests.
        const recipient = process.env.EMAIL_TO || 'ninoprime@hotmail.com';

        const mailOptions = {
            from: process.env.EMAIL_USER || '"Les Amis du CBD" <no-reply@lesamisducbd.fr>',
            to: recipient,
            replyTo: email,
            subject: `Nouveau contact Buraliste : ${company}`,
            text: `
Nouveau prospect Buraliste !

Nom : ${name}
Société : ${company}
Email : ${email}
Téléphone : ${phone}

Message :
${message || 'Aucun message.'}
            `,
            html: `
                <h3>Nouveau prospect Buraliste !</h3>
                <ul>
                    <li><b>Nom :</b> ${name}</li>
                    <li><b>Société :</b> ${company}</li>
                    <li><b>Email :</b> ${email}</li>
                    <li><b>Téléphone :</b> ${phone}</li>
                </ul>
                <p><b>Message :</b><br/> ${message ? message.replace(/\n/g, '<br/>') : 'Aucun message.'}</p>
            `
        };

        // Si l'utilisateur n'a pas configuré l'email, on fait semblant que ça marche dans la console
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('--- [DEV] EMAIL NON ENVOYÉ (Manque EMAIL_USER/EMAIL_PASS) ---');
            console.log(mailOptions.text);
            return NextResponse.json({ success: true, simulated: true });
        }

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email:", error);
        return NextResponse.json({ error: "Erreur serveur lors de l'envoi" }, { status: 500 });
    }
}
