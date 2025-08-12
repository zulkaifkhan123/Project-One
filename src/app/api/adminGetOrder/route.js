import { NextResponse } from "next/server";
import dbConnection from "../../../lib/Connection"; 
import Order from "../../../models/Order";

export async function GET(req) {
  await dbConnection();
  try {
    const orders = await Order.find()
      .populate("items.products")
      .populate("user")
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return NextResponse.json({
        message: "No orders found",
        status: 404,
        success: false,
      });
    }

    // here i am creating a simple object to group orders by user id
    const grouped = {};

    for (const order of orders) {
      const userId = order.user._id.toString();

      if (!grouped[userId]) {
        grouped[userId] = {
          user: order.user,
          orders: [],
        };
      }

      // Add order to this user's orders array
      grouped[userId].orders.push({
        _id: order._id,
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
        adminNotes: order.adminNotes,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      });
    }

    // Convert grouped object to array for response
    const result = Object.values(grouped);

    return NextResponse.json({
      message: "Orders grouped by user",
      status: 200,
      success: true,
      data: result,
    });

  } catch (error) {
    return NextResponse.json({
      message: "Error fetching orders: " + error.message,
      status: 500,
      success: false,
    });
  }
}
