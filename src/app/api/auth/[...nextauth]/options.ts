import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentils",

            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
                password: { label: "Password", type: "password" 
                }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })

                    if(!user){
                        throw new Error("No user found with this email");
                    }

                    if(!user.isVerified){
                        throw new Error("Please verify your email before login");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if(!isPasswordCorrect){
                        throw new Error("Incorrect Password");
                    }
                } catch (error: any) {
                    throw new Error("Error connecting to database", error)
                }
            }
        })
    ],

    callbacks: {
        async jwt({token, user}) {
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            
            return token
        },
        async session({ session, token }){
            if(token){
                session.user._id = token._id;
                session.user.isVerfied = token.isVerfied;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            
            return session
        }
    },

    pages: {
        signIn: '/sign-in'
    },
    session: {strategy: 'jwt'},
    secret: process.env.NEXTAUTH_SECRET
}