// /src/lib/Auth.js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const validateEmail = (email) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(String(email).toLowerCase());
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        console.log('credentials', credentials);
        // Response.json()
        const { username, password } = credentials;

        // if (!validateEmail(username)) {
        //   throw new Error('Invalid email format.');
        // }

        // if (!username || !password) {
        //   throw new Error('Missing credentials.');
        // }

        return { id: 1, username: 'test@gmail.com' };

        // const user = new User();
        // const foundUser = await user.getFirst({ username });

        // if (foundUser && (await compare(password, foundUser.password))) {
        //   return { id: foundUser.id, username: foundUser.username };
        // }
      },
    }),
  ],

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
});
