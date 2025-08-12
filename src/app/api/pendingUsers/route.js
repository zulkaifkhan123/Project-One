// this is the api route for pending users to fetch in admin dashbaord
// for aproval or rejection

import { NextResponse } from "next/server";
import dbConnection from "../../../lib/Connection";
import User from "../../../models/User";

export async function GET(req) {
  try {
    await dbConnection();
    const pendingUsers = await User.find({ account_status: "pending" });
    if (!pendingUsers) {
      return NextResponse.json({
        message: "No Pending User",
        status: 205,
      });
    }
    return NextResponse.json({
      users: pendingUsers,
      message: "Successfully get pending users",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      message:
        "Internet Server Error / Failed api call of getting users (pending )",
      status: 205,
    });
  }
}
