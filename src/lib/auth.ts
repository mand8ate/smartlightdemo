import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import { NextAuthOptions, getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { loginSchema } from "./schemas/loginSchema";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: { signIn: "/signin" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const parsedCredentials = loginSchema.safeParse(credentials);

          if (parsedCredentials.success) {
            const user = await db.user.findFirst({
              where: { email: credentials!.email },
            });
            // Check hashed password
            if (!user) console.log("User not found");
            const passwordMatch = await bcrypt.compare(
              parsedCredentials.data.password,
              user!.password
            );
            if (passwordMatch) {
              return {
                id: user!.id,
                name: user!.name,
                email: user!.email,
              };
            }
          }
          return null;
        } catch (error) {
          throw new Error("Something went wrong");
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      return session;
    },
    async jwt({ token, user, account, profile }) {
      return token;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
