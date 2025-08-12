import { NextResponse } from "next/server";
import dbConnection from "../../../lib/Connection";
import User from "../../../models/User";

export async function POST(req) {
    try {
        await dbConnection();

        const body = await req.json();
        const username = body.username;
        const verifyCode = body.verifyCode || body.verification_code; 

        if (!username || !verifyCode) {
            return NextResponse.json({
                message: "Username and verification code are necessary for verification"
            }, { status: 400 });
        }

        const checkUser = await User.findOne({ username });
        if (!checkUser) {
            return NextResponse.json({
                message: "User does not exist. Please sign up first"
            }, { status: 404 });
        }

        if (checkUser.verification_code !== verifyCode) {
            return NextResponse.json({
                message: "Your verification code is incorrect"
            }, { status: 401 });
        }

        const expiry = checkUser.code_expiry;
        const isExpired = Date.now() > new Date(expiry).getTime();
        if (isExpired) {
            return NextResponse.json({
                message: "Your verification code has expired. Please sign up again!"
            }, { status: 410 });
        }

        checkUser.verification_code = undefined;
        checkUser.code_expiry = undefined;
        checkUser.isVerified = true;
        const finalUser = await checkUser.save();

        const { password, ...safeUser } = finalUser.toObject();

        return NextResponse.json({
            message: "User successfully verified!",
            verified_user: safeUser
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            message: "User failed verification due to server error",
            error: error.message
        }, { status: 500 });
    }
}
