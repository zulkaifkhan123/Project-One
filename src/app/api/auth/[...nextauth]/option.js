import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "../../../../models/User";
import dbConnect from "../../../../lib/Connection";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const { identifier, password } = credentials;

        const user = await User.findOne({
          $or: [{ email: identifier }, { username: identifier }]
        });

        if (!user) throw new Error("User not found with these credentials!");
        if (!user.isVerified) throw new Error("Please verify your email!");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error("Password is incorrect.");

        return user;
      }
    })
  ],
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 * 60, 
    updateAge: 24 * 60 * 60 * 60
  },
   jwt: {
    maxAge: 30 * 24 * 60 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id?.toString();
        token.username = user.username;
        token.email = user.email;
        token.isVerified = user.isVerified;
        token.account_status = user.account_status;
        token.phone_number = user.phone_number;
        token.website = user.website;
        token.shipping_address = user.shipping_address;
        token.business_name = user.business_name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.isVerified = token.isVerified;
        session.user.phone_number = token.phone_number;
        session.user.website = token.website;
        session.user.shipping_address = token.shipping_address;
        session.user.business_name = token.business_name;
      }
      return session;
    }
  }
};

export default authOptions;
