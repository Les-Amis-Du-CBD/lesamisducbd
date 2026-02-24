import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email manquant' }, { status: 400 });
        }

        const brevoApiKey = process.env.BREVO_API_KEY;
        const brevoListId = process.env.BREVO_LIST_ID;

        if (!brevoApiKey || !brevoListId) {
            console.error("Configuration Brevo manquante dans .env.local (BREVO_API_KEY ou BREVO_LIST_ID)");
            // En dev, on simule le succès si les clés ne sont pas encore là
            return NextResponse.json({ success: true, simulated: true, message: "[DEV] Inscription simulée (Manque clés Brevo)" });
        }

        const response = await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': brevoApiKey
            },
            body: JSON.stringify({
                email: email,
                listIds: [parseInt(brevoListId, 10)],
                updateEnabled: false // Ne pas mettre à jour si le contact existe déjà (pour renvoyer une erreur)
            })
        });

        if (!response.ok) {
            const errorData = await response.json();

            // Code spécifique de Brevo quand l'email existe déjà
            if (errorData.code === 'duplicate_parameter') {
                return NextResponse.json({ error: "Vous êtes déjà inscrit à la newsletter !" }, { status: 400 });
            }

            console.error("Erreur API Brevo:", errorData);
            return NextResponse.json({ error: "Impossible de valider votre inscription pour le moment." }, { status: 400 });
        }

        // Brevo renvoie un 201 Created quand ça marche
        return NextResponse.json({
            success: true,
            message: "Inscription validée avec succès !"
        });

    } catch (error) {
        console.error("Erreur serveur Newsletter API (Brevo):", error);
        return NextResponse.json({ error: "Erreur technique lors de l'inscription à la newsletter" }, { status: 500 });
    }
}
