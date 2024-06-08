import NextAuth from "next-auth";
import {saltAndHashPassword } from "@/lib/Functions"
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/models/User";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
  } = NextAuth({
    pages: {
     signIn: '/login',
      error: '/login'
    },
    providers: [
        CredentialsProvider({
          async authorize(credentials, req) {
            // Add logic here to look up the user from the credentials supplied

            const pwHash = saltAndHashPassword(credentials.password)
            let [username, password ] = credentials;
            const user = User.where({username:username, password:password});
            console.log(user)
      
            if (user) {
              // Any object returned will be saved in `user` property of the JWT
              return user;

            } else {
              // If you return null then an error will be displayed advising the user to check their details.
              throw new Error("User not found.")   
              // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
            
            }
          }
        })
      ],
  });

