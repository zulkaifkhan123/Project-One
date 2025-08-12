import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import User from "../../../../models/User"
import dbConnect from "../../../../lib/Connection"
     
const authOptions = {
providers: [
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      username: { label: "Username", type: "text", placeholder: "jsmith" },
      email: { label: "email", type: "email" }
    },
    async authorize(credentials, req) {
        await dbConnect()
        try {
            const checkUser = await User.find({$or : [
                {email : credentials.email} , 
                {username : credentials.username}
            ]})
            if(!checkUser){
                throw new Error("User not found with these credientials!") ;
            }
            if(checkUser.isVerified !== true){
                throw new Error("Please Verify Your Email by Signing Up again !");
            }
            const checkPassword = bcrypt.compare(credentials.password , checkUser.password)
            if (!checkPassword) throw new Error("Password is incorrect.");

            return checkUser ;
        } catch (error) {
            throw new Error(error.message || "Authorization failed.");
        }
    }

  })
],
pages : {
    signIn : "/login"
} , 
session: {
    strategy: "jwt",
  },
secret: process.env.NEXTAUTH_SECRET,
callbacks: {
  async jwt({ token, checkUser }) {
    if (checkUser) {
      token.id = checkUser._id?.toString();
      token.username = checkUser.username ;
      token.email = checkUser.email ;
      token.isVerified = checkUser.isVerified ;
      token.account_status = checkUser.account_status
    }
    return token
  },
  async session({ session, token }) {
    if(token){
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.isVerified = token.isVerified;
      session.user.isAcceptingMessage = token.isAcceptingMessage;
    }
    return session
  }
}

}

export default authOptions ;