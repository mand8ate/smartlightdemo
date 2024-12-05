import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import { DefaultSession, NextAuthOptions, getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { loginSchema } from "./schemas/loginSchema";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
		} & DefaultSession["user"];
	}
}

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
					const parsedCredentials =
						loginSchema.safeParse(credentials);

					if (parsedCredentials.success) {
						const user = await db.user.findFirst({
							where: { email: credentials!.email },
						});
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
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
			}
			return session;
		},
		async jwt({ token, user, account }) {
			if (account) {
				token.accessToken = account.access_token;
				token.id = user?.id;
			}
			return token;
		},
	},
};

export const getAuthSession = () => getServerSession(authOptions);
