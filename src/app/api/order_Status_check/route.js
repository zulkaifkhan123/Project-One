import { NextResponse } from "next/server";
import dbConnection from "../../../lib/Connection";
import Order from "../../../models/Order";

export async function GET(req) {
  await dbConnection();
  try {
    const userId = new URL(req.url).searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({
        message: "User ID is required",
        status: 400,
        success: false,
      });
    }

    const order = await Order.findOne({
  user: userId,
  status: { $in: ["pending", "approved", "rejected"] },
})
  .populate({ path: "items.products", strictPopulate: false }) // <--- add strictPopulate
  .sort({ createdAt: -1 });


    if (!order) {
      return NextResponse.json({
        message: "No active orders found",
        status: 404,
        success: false,
      });
    }

    return NextResponse.json({
      message: "Order fetched",
      status: 200,
      success: true,
      data: order, // ✅ adminNotes will be included here automatically
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error fetching orders: " + error.message,
      status: 500,
      success: false,
    });
  }
}
