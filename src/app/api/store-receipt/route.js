import { NextResponse } from "next/server";
import dbConnection from "../../../lib/Connection";
import Receipt from "../../../models/Recepit";
import User from "../../../models/User";
import Order from "../../../models/Order";
import Cart from "../../../models/Cart";
import Product from "../../../models/Product";

export async function POST(req) {
  try {
    await dbConnection();

    const body = await req.json();
    const { userId, orderId, receiptUrl } = body;

    if (!userId || !orderId || !receiptUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    order.status = "paid";
    await order.save();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    if (Array.isArray(order.items)) {
      for (const item of order.items) {
        if (item.products) {
          await Product.findByIdAndUpdate(item.products, {
            $inc: { productQuantity: -item.quantity },
          });
        }
      }
    }

    const receipt = await Receipt.create({
      userId,
      orderId,
      receiptUrl,
      status: "paid",
    });

    return NextResponse.json(
      { message: "Receipt saved successfully", receipt },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error saving receipt:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnection();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const orderId = searchParams.get("orderId");

    let query = {};
    if (userId) query.userId = userId;
    if (orderId) query.orderId = orderId;

    const receipts = await Receipt.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ receipts }, { status: 200 });
  } catch (err) {
    console.error("Error fetching receipts:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
