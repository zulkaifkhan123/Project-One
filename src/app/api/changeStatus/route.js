import { NextResponse } from "next/server";
import dbConnection from "../../../lib/Connection";
import User from "../../../models/User";
import { EmailVerification } from "../../../Helper/email_verification";

export async function PUT(req) {
  await dbConnection();
  try {
    const { userId, status } = await req.json();

    if (userId.length == 0 || status.length == 0) {
      return NextResponse.json({
        message: "Userid and status is required for changing status of user",
        status: 300,
        success: false,
      });
    }

    if (status === "approved") {
      const changeUser = await User.findByIdAndUpdate(
        userId,
        { account_status: "approved" },
        { new: true }
      );
      console.log("Succcessfully Approved by Admin", changeUser);
      EmailVerification(changeUser.email, changeUser.name, "approved");
    } else if (status === "suspended") {
      const changeUser = await User.findByIdAndDelete(
        userId,
        { account_status: "suspended" },
        { new: true }
      );
      console.log("Succcessfully Suspended Status by Admin", changeUser);
    }

    return NextResponse.json({
      message: "Succcessfully Change Status of User by Admin",
      status: 200,
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Internet Server Error / Failed Approval by Admin",
      status: 500,
      success: false,
    });
  }
}
