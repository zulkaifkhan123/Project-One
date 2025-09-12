import { NextResponse } from "next/server";
import dbConnection from "../../../lib/Connection";
import User from "../../../models/User";

export async function GET(req) {
  try {
    await dbConnection();

    // Use .lean() to return plain JS objects instead of Mongoose Documents
    let pendingUsers = await User.find({ account_status: "pending" }).lean();

    if (!pendingUsers || pendingUsers.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No pending users found",
        status: 404,
        data: [],
      });
    }

    // ✅ Do NOT encode URLs in base64. Just return them directly.
    pendingUsers = pendingUsers.map(user => ({
      ...user,
      tax_id: user.tax_id || null,                 // Cloudinary secure_url
      business_licence: user.business_licence || null, // Cloudinary secure_url
    }));

    return NextResponse.json({
      success: true,
      message: "Successfully fetched pending users",
      status: 200,
      data: pendingUsers,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal Server Error: " + error.message,
      status: 500,
      data: [],
    });
  }
}
