import User from "../../../models/User";
import { NextResponse } from "next/server";
import dbConnection from "../../../lib/Connection";
import { EmailVerification } from "../../../Helper/email_verification";

export async function POST(request) {
  try {
    await dbConnection();

    const body = await request.json();
    const {
      username,
      email,
      business_name,
      tax_id,
      business_licence,
      phone_number,
      website,
      password,
      billing_address,
      shipping_address,
    } = body;

    if (
      !username ||
      !email ||
      !tax_id ||
      !business_licence ||
      !phone_number ||
      !password ||
      !billing_address ||
      !shipping_address ||
      !business_name
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const expiryDate = Date.now() + 360000; // 6 minutes

    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json(
          { error: "User Already Exist with these Credentials!" },
          { status: 400 }
        );
      } else {
        await User.updateOne(
          { _id: existingUser._id },
          {
            verification_code: verificationCode,
            code_expiry: expiryDate,
          }
        );
        console.log("Existing user updated with new verification code");

        const send = await EmailVerification(email, username, verificationCode);
        if (!send.success) {
          return NextResponse.json(
            { success: false, message: send.message },
            { status: 500 }
          );
        }

        return NextResponse.json(
          { message: "Verification code sent to your email" },
          { status: 200 }
        );
      }
    } else {
      const createUser = await User.create({
        username,
        email,
        password,
        tax_id,
        phone_number,
        billing_address,
        shipping_address,
        website,
        business_licence,
        business_name,
        code_expiry: expiryDate,
        verification_code: verificationCode,
      });
      console.log("New user created:", createUser);
      if (!createUser) {
        return NextResponse.json(
          { error: "Failed to create user" },
          { status: 500 }
        );
      }
    }

    console.log("Code is working...");
    const send = await EmailVerification(email, username, verificationCode);
    if (!send.success) {
      console.error("Email sending failed:", send.message);
      return NextResponse.json(
        { success: false, message: send.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "User created successfully", emailStatus: send.message },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in signup route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
