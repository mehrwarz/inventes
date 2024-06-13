import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/models/User";
import pool from "@/lib/Connection";
import bcrypt from "bcrypt";

// Function to validate email format
const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "credentials",
      // `credentials` is used to generate a form on the sign in page
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Enter email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Validate username (email) format
        if (!validateEmail(credentials.username)) {
          throw new Error("Please enter a valid email address");
        }

        // Check for missing credentials
        if (!credentials.username || !credentials.password) {
          throw new Error("Please enter both Username and Password");
        }

        const user = new User();
        const foundUser = await user.getFirst({ username: credentials.username });
        if (foundUser != undefined) {
          const isValid = await bcrypt.compare(credentials.password, foundUser.password);
          if (isValid) {
            // Return user object with additional data (optional)
            return { ...foundUser}; 
          }
        }
        // If you return null or false, the authentication will fail
        req.next({ path: '/auth/error', query: { message: 'Credentials do not match.' } });
        throw new Error("Credentials does not match.");
      },
    }),
  ],

  // Custom login and error pages.
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  // Database connection
  database: pool,

  // Postgreaql driver
  driver: { type: "pg" },

  // Enable debug logging (for development only)
  debug: process.env.NODE_ENV === "development",
  // Enable session support
  session: { jwt: true },
  // Enable JWT support
  jwt: {
    secret: process.env.SECRET_KEY,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.SECRET_KEY,

  callbacks: {
    async jwt({ token, account, profile, user }) {
        // Check if user object is available
        if (user) {
          // Include relevant user data in the token
          token.user = {...user};
        }
      return token;
    },

    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};

export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth(authOptions);
