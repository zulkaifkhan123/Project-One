import dbConnection from "../../../lib/Connection";
import Order from "../../../models/Order";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnection();

  try {
    const userId = new URL(req.url).searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const orders = await Order.find({
      user: userId,
      status: "paid",
    })
      .populate("items.products") // ✅ products inside order items
      .populate("user", "name email") // ✅ fetch only `name` and `email` from User
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        message: orders.length
          ? "Paid orders fetched successfully"
          : "No paid orders found",
        data: orders,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching paid orders: " + error.message,
      },
      { status: 500 }
    );
  }
}
