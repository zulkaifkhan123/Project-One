import User from "../../../models/User";
import dbConnection from "../../../lib/Connection";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { EmailVerification } from "../../../Helper/email_verification";

export async function POST(request) {
  await dbConnection();
  try {
    const {
      username,
      email,
      password,
      business_name,
      tax_id,
      business_licence,
      phone_number,
      website,
      billing_address,
      shipping_address,
    } = await request.json();

    if (
      !username ||
      !email ||
      !password ||
      !business_name ||
      !tax_id ||
      !business_licence ||
      !phone_number ||
      !billing_address ||
      !shipping_address
    ) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters long",
        },
        { status: 400 }
      );
    }

    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(phone_number)) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number format" },
        { status: 400 }
      );
    }

    const existingUserByEmail = await User.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json(
          { success: false, message: "User already exists with this email" },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.username = username;
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verification_code = verifyCode;
        existingUserByEmail.code_expiry = new Date(Date.now() + 3600000);
        existingUserByEmail.business_name = business_name;
        existingUserByEmail.tax_id = tax_id;
        existingUserByEmail.business_licence = business_licence;
        existingUserByEmail.phone_number = phone_number;
        existingUserByEmail.website = website;
        existingUserByEmail.billing_address = billing_address;
        existingUserByEmail.shipping_address = shipping_address;

        await existingUserByEmail.save();

        const emailResponse = await EmailVerification(
          email,
          username,
          verifyCode
        );

        if (!emailResponse.success) {
          return NextResponse.json(
            { success: false, message: emailResponse.message },
            { status: 500 }
          );
        }

        return NextResponse.json(
          {
            success: true,
            message: "Verification code resent. Please check your email.",
          },
          { status: 200 }
        );
      }
    } else {

      // const hashedPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new User({
        username,
        email,
        password: password,
        verification_code: verifyCode,
        code_expiry: expiryDate,
        isVerified: false,
        business_name,
        tax_id,
        business_licence,
        phone_number,
        website,
        billing_address,
        shipping_address,
      });

      await newUser.save();

      const emailResponse = await EmailVerification(
        email,
        username,
        verifyCode
      );

      if (!emailResponse.success) {
        return NextResponse.json(
          { success: false, message: emailResponse.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Register Successfully. Verify your account now !",
        user: {
          username: newUser.username,
          email: newUser.email,
        },
      });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}
