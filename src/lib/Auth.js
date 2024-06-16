// /src/lib/Auth.js
import User from "@/app/models/User";
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { randomString } from "@/lib/Functions"

const validateEmail = (email) => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(String(email).toLowerCase());
};

export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth({
    session: {
        strategy: 'jwt',
        generateSessionToken: await randomString(32),
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        CredentialsProvider({
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials, req) {
                // Response.json()
                const { username, password } = credentials;

                if (!validateEmail(username)) {
                    throw new Error("Invalid email format.");
                }

                if (!username || !password) {
                    throw new Error("Missing credentials.");
                }

                const user = new User();
                const foundUser = await user.getFirst({ username });

                if (foundUser && (await compare(password, foundUser.password))) {
                    return { id: foundUser.id, username: foundUser.username };
                }
                console.log("Before returning null")
                return null
            },
        }),
    ],

    // JWT configuration for session management
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        maxAge: 30 * 24 * 60 * 60, // 30 days
        url: process.env.NEXTAUTH_URL || `http://localhost:${process.env.PORT || 3000}`,
    },

    // Callbacks for customizing JWT and session objects
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = { id: user.id, username: user.username };
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user;
            return session;
        },
    },

    // Enable debug mode in development environment
    // debug: process.env.NODE_ENV === "development",

    // Set session storage using JWT
    session: { jwt: true },

    // Database connection string (if applicable)
    database: process.env.Database_URL,
});
