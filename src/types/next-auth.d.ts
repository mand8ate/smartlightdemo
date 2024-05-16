import NextAuth from "next-auth";

declare module "next-auth" {
    interface session {
        user: {
            id: string;
            password: string;
        }
    }
}