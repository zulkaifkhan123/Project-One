import { NextResponse } from "next/server";
import dbConnection from "../../../lib/Connection";
import User from "../../../models/User";

export async function GET(req) {
    await dbConnection();
    try {
        const users = await User.find().lean();
        if (!users || users.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No users found",
                status: 404,
                data: [],
            });
        }
        return NextResponse.json({
            success: true,
            message: "Successfully fetched all users",
            status: 200,
            data: users,
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


export async function DELETE(req) {
  await dbConnection();
  try {
    const { userId } = await req.json();

    if (!userId || userId.length === 0) {
      return NextResponse.json({
        message: "User ID is required for deletion",
        status: 400,
        success: false,
      });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({
        message: "User not found or already deleted",
        status: 404,
        success: false,
      });
    }

    console.log("Successfully deleted user:", deletedUser);

    return NextResponse.json({
      message: "User deleted successfully",
      status: 200,
      success: true,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({
      message: "Internal Server Error / Failed to delete user",
      status: 500,
      success: false,
    });
  }
}
