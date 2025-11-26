
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { dbClient } from "@/lib/dbConnect"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: MongoDBAdapter(dbClient()),
    providers: [Google],
    session: { strategy: "jwt" }, // Recommandé pour limiter les appels DB
    callbacks: {
        session({ session, token }) {
            // Ajoute l'ID utilisateur à la session pour l'utiliser dans le front/back
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
})