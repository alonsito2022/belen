import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import {connectDB} from '@/libs/mongodb'
import User from '@/models/user';
import { IUser } from '@/app/types';
import bcrypt from 'bcryptjs';


const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "jsmith" },
                password: { label: "Password", type: "password", placeholder: "******" },
                role: { label: "Role", type: "text", placeholder: "rol" }
            },
            async authorize(credentials, req) {
                
                let queryfecth = `
                    mutation {
                        auth(email: "${credentials?.email}", password: "${credentials?.password}", role: "${credentials?.role}") {
                            user {
                                id
                                username
                                firstName
                                lastName
                                phone
                                email
                                document
                                isSuperuser
                                isStaff
                                lastLogin
                                role
                                roleReadable
                            }
                            message
                        }
                    }
                `;
                const apiUserResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/graphql`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify({
                        query: queryfecth
                    })
                });
                

                const data: any = await apiUserResponse.json()
                if (apiUserResponse.ok && data) {
                    
                    if(data.data.auth)
                        return data.data.auth.user
                    else
                        throw new Error(data.errors[0].message);
                }
                return null
            }
        })
    ],
    callbacks: {
        jwt({ account, token, user, profile, session }) {
          if(user) token.user=user;
          return token;
        },
        session({ session, token }) {

            session.user = token.user as any;
            return session
           
        }
    },
    pages: {
        signIn: '/login',
    }
})

export { handler as GET, handler as POST }