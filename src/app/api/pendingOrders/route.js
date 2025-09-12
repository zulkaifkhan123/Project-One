import { NextResponse } from "next/server";
import dbConnection from "../../../lib/Connection"; // adjust path if needed
import Order from "../../../models/Order";

export async function GET() {
  await dbConnection();

  try {
    const orders = await Order.find({ status: "pending" })
      .populate("user", "name email") // get user details
      .populate("items.products", "productName productPrice"); 

    if (!orders || orders.length === 0) {
      return NextResponse.json({
        message: "No pending orders found",
        status: 404,
        success: false,
        data: [],
      });
    }

    return NextResponse.json({
      message: "Pending orders fetched successfully",
      status: 200,
      success: true,
      data: orders,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error fetching pending orders: " + error.message,
      status: 500,
      success: false,
    });
  }
}
