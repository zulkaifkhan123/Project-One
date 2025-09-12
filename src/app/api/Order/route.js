import { NextResponse } from "next/server";
import dbConnection from "../../../lib/Connection";
import Order from "../../../models/Order";

export async function POST(req) {
  await dbConnection();

  try {
    const { user, items, totalAmount, status, adminNotes } = await req.json();

    if (typeof totalAmount !== "number" || totalAmount <= 0) {
      return NextResponse.json({
        message: "Total amount must be a positive number",
        status: 400,
        success: false,
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({
        message: "Items must be a non-empty array",
        status: 400,
        success: false,
      });
    }

    // Prevent multiple pending orders per user
    const existingOrder = await Order.findOne({ user, status: "pending" });
    if (existingOrder) {
      return NextResponse.json({
        message: "You already have a pending order",
        status: 400,
        success: false,
      });
    }

    const newOrder = new Order({
      user,
      items: items.map((i) => ({
        products: i.products,
        quantity: i.quantity || 1,
      })),
      totalAmount,
      status: status || "pending",
      adminNotes: adminNotes || "",
    });

    await newOrder.save();

    return NextResponse.json({
      message: "Order created successfully",
      status: 201,
      success: true,
      data: newOrder,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error creating order / Internal Server Error: " + error.message,
      status: 500,
      success: false,
    });
  }
}

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

    const order = await Order.findOne({ user: userId, status: "pending" })
      .populate("items.products")
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
      data: order,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error fetching orders: " + error.message,
      status: 500,
      success: false,
    });
  }
}

export async function DELETE(req) {
  await dbConnection();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const orderId = searchParams.get("orderId");
    if (!userId || !orderId) {
      return NextResponse.json({
        message: "User ID and Order ID are required",
        status: 400,
        success: false,
      });
    } 
    const order = await Order.findOneAndDelete({ _id: orderId, user: userId });
    if (!order) {
      return NextResponse.json({
        message: "No order found to cancel",
        status: 404,
        success: false,
      });
    }
    return NextResponse.json({
      message: "Order cancelled successfully",
      status: 200,
      success: true,
      data: order,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error cancelling order: " + error.message,
      status: 500,
      success: false,
    });
  }
}