import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    session: {
      strategy: 'jwt',
    },
    providers: [
        CredentialsProvider({
            credentials: {
                username: {},
                password: {},
            },
            async authorize(credentials) {
                if (credentials === null) return null;
                try {
                    const response = await fetch(process.env.NEXTAUTH_URL + '/api/admin/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(credentials),
                    });
                    if (!response.ok) {
                        throw new Error('Thông tin đăng nhập không chính xác!');
                    }
                    const user = await response.json();
                    return user;
                } catch (error: any) {
                    throw new Error(error.stack);
                }
            },
        }),
    ],
    callbacks: {
        authorized: async ({auth}) => {
            return !!auth
        },
        async jwt({token, user}) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({session, token}: {session: any, token: any}) {
            session.user.id = (token.user as any).id;
            return session;
        },
    },
    pages: {
        signIn: '/admin/login',
    },
});