import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import User from "@/app/models/User"
import { compareHash } from "./Functions"
import { error } from "console";


export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can also define a function to get the credentials.
      // The function should return a promise that resolves with an object containing the credentials.
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials, req) {
        // Check if the credentials has valid data and is not empty.
        if (!credentials.username || !credentials.password) {
          throw error({ error: "Invalid credentials" }) // Add error message
        }
        // Add logic here to look up the user from the credentials supplied
        const userObj = new User();
        const user = await userObj.getFirst({ username: credentials.username });
        if (!user) {
          return { error: "Invalid username" } // Add error message
        }
        const isValid = await compareHash(credentials.password, user.password)
        if (!isValid) {
          return { error: "Incorrect password" } // Add error message
        }
        return user
      },      
    }),
  ],
});

