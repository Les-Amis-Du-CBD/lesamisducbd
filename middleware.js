import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // Optionnel : Ajouter des vérifications de rôles ici si besoin plus tard
        // par exemple, bloquer l'accès à /admin pour les rôles 'client'
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        },
    }
);

// Spécifier les routes qui nécessitent une authentification
export const config = {
    matcher: [
        "/account/:path*",
        "/checkout/:path*"
    ]
};
