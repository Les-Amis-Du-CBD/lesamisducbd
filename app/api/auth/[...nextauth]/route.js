import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { kv } from '@vercel/kv';
import bcrypt from 'bcryptjs';

const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const userKey = `user:${credentials.email.toLowerCase()}`;
                    const user = await kv.get(userKey);

                    if (!user) {
                        console.error("[NextAuth] Aucun utilisateur trouvé avec:", credentials.email);
                        throw new Error("Identifiants incorrects.");
                    }

                    // Vérifier le mot de passe avec bcrypt
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordValid) {
                        console.error("[NextAuth] Mot de passe invalide pour:", credentials.email);
                        throw new Error("Identifiants incorrects.");
                    }

                    // Retourner les informations utilisateur pour le JWT
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role || 'client',
                        company: user.company || ''
                    };
                } catch (e) {
                    console.error("[NextAuth] Erreur authentification globale:", e);
                    throw new Error(e.message || "Erreur serveur lors de la connexion.");
                }
            }
        })
    ],
    pages: {
        signIn: '/connexion',
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // Premier login, persister les données étendues dans le JWT
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.company = user.company;
            }

            // Mettre à jour la session si `update` est appelé par le client
            if (trigger === "update" && session) {
                token = { ...token, ...session.user };
            }

            return token;
        },
        async session({ session, token }) {
            // Passer les données du JWT à la session Front-end
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.company = token.company;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 Days
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_local_dev_only",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
