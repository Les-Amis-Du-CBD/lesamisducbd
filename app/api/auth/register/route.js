import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password, firstname, lastname, birthday, company, siret } = body;

        // Validation basique
        if (!email || !password || !firstname || !lastname) {
            return NextResponse.json({ success: false, message: 'Prénom, nom, email et mot de passe sont requis' }, { status: 400 });
        }

        const userKey = `user:${email.toLowerCase()}`;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await kv.get(userKey);
        if (existingUser) {
            return NextResponse.json({ success: false, message: 'Un compte avec cet email existe déjà' }, { status: 409 });
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'objet utilisateur
        const newUser = {
            id: Date.now().toString(),
            email: email.toLowerCase(),
            name: `${firstname} ${lastname}`.trim(),
            firstname,
            lastname,
            password: hashedPassword,
            birthday: birthday || '',
            company: company || '',
            siret: siret || '',
            role: 'client',
            id_default_group: 3, // Groupe Client par défaut — modifié uniquement par l'admin PrestaShop
            addresses: [],
            createdAt: new Date().toISOString()
        };

        // Sauvegarder dans Vercel KV
        await kv.set(userKey, newUser);

        // Ne pas renvoyer le mot de passe dans la réponse
        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json({
            success: true,
            message: 'Compte créé avec succès',
            user: userWithoutPassword
        }, { status: 201 });

    } catch (error) {
        console.error('[Register API] Error:', error);
        return NextResponse.json({ success: false, message: 'Erreur lors de la création du compte' }, { status: 500 });
    }
}
