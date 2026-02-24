import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { kv } from '@vercel/kv';
// Vous devez importer ou reconstruire vos authOptions ici
// Par exemple: import { authOptions } from "../auth/[...nextauth]/route"; 
// Comme authOptions est dans route.js, on va faire une requête "neutre" basée sur la session.
import NextAuth from "next-auth/next";

export async function GET(req) {
    try {
        const session = await getServerSession();

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });
        }

        const userKey = `user:${session.user.email.toLowerCase()}`;
        const user = await kv.get(userKey);

        if (!user) {
            return NextResponse.json({ success: false, message: 'Utilisateur introuvable' }, { status: 404 });
        }

        // On ne renvoie jamais le mot de passe
        const { password: _, ...safeUser } = user;

        return NextResponse.json({ success: true, user: safeUser }, { status: 200 });

    } catch (error) {
        console.error('[Profile GET API] Error:', error);
        return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getServerSession();

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ success: false, message: 'Non autorisé' }, { status: 401 });
        }

        const body = await req.json();

        const userKey = `user:${session.user.email.toLowerCase()}`;
        const existingUser = await kv.get(userKey);

        if (!existingUser) {
            return NextResponse.json({ success: false, message: 'Utilisateur introuvable' }, { status: 404 });
        }

        // Mettre à jour les champs autorisés
        const updatedUser = {
            ...existingUser,
            name: body.name !== undefined ? body.name : existingUser.name,
            company: body.company !== undefined ? body.company : existingUser.company,
            siret: body.siret !== undefined ? body.siret : existingUser.siret,
            addresses: body.addresses !== undefined ? body.addresses : existingUser.addresses,
            updatedAt: new Date().toISOString()
        };

        // Sauvegarder dans KV
        await kv.set(userKey, updatedUser);

        const { password: _, ...safeUser } = updatedUser;

        return NextResponse.json({
            success: true,
            message: 'Profil mis à jour',
            user: safeUser
        }, { status: 200 });

    } catch (error) {
        console.error('[Profile PUT API] Error:', error);
        return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
    }
}
