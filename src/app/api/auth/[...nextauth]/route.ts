import NextAuth, { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { compare } from 'bcrypt';
import prismadb from '@/app/libs/prismadb';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
   adapter: PrismaAdapter(prisma),
   providers: [
      GithubProvider({
         clientId: process.env.GITHUB_ID || '',
         clientSecret: process.env.GITHUB_SECRET || '',
      }),
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID || '',
         clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      }),
      Credentials({
         id: 'credentials',
         name: 'Credentials',
         credentials: {
            email: {
               label: 'Email',
               type: 'text',
            },
            password: {
               label: 'Password',
               type: 'passord',
            },
         },
         async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
               throw new Error('Email and password required');
            }

            const user = await prismadb.user.findUnique({
               where: {
                  email: credentials.email,
               },
            });

            if (!user || !user.hashedPassword) {
               throw new Error('Email does not exist');
            }

            const isCorrectPassword = await compare(
               credentials.password,
               user.hashedPassword
            );

            if (!isCorrectPassword) {
               throw new Error('Incorrect password');
            }

            return user;
         },
      }),
   ],
   callbacks: {
      async session({ session, token, user }) {
         session.user.id = token.sub;
         return session;
      },
      async jwt({ token, account, profile }) {
         if (account) {
            token.accessToken = account.access_token;
         }
         return token;
      },
   },
   pages: {
      signIn: '/auth',
   },
   debug: process.env.NODE_ENV === 'development',
   session: { strategy: 'jwt' },
   jwt: {
      secret: process.env.NEXTAUTH_JWT_SECRET,
   },
   secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
