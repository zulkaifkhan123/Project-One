
import { NextResponse } from "next/server";
import dbConnection from "../../../lib/Connection"; 
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import { URL } from "url";

export async function POST(req) {
  await dbConnection();

  try {
    const { user, products, quantity , totalAmount , status , adminNotes } = await req.json();

    if (typeof totalAmount !== "number" || totalAmount <= 0) {
      return NextResponse.json({
        message: "Total amount must be a positive number",
        status: 400,
        success: false
      })
    }

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({
        message: "Products must be a non-empty array",
        status: 400,
        success: false
        });
    }

   const existingOrder = await Order.findOne({ user });

    if (existingOrder) {
      return NextResponse.json({
        message: "An order for this user already exists",
        status: 400,
        success: false
      });
    }
    
    const qty = typeof quantity === "number" && quantity > 0 ? quantity : 1;

    const items = products.map((productId, index) => ({
      products: productId,
      quantity: qty
    }));

    const newOrder = new Order({
      user,
      items,
      totalAmount,
      status: status || "pending",
      adminNotes: adminNotes || "",
    });

    await newOrder.save();

    return NextResponse.json({
      message: "Order created successfully",
      status: 201,
      success: true,
      data: newOrder
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error creating order / Internal Server Error: " + error.message,
      status: 500,
      success: false
    });
  }
}

export async function GET(req) {
  await dbConnection();
  try {
    const userId = new URL(req.url).searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User ID is required", status: 400, success: false });
    }

    const orders = await Order.findOne({ user: userId })
      .populate("items.products")
      .sort({ createdAt: -1 });

    if (orders.length === 0) {
      return NextResponse.json({ message: "No orders found", status: 404, success: false });
    }

    return NextResponse.json({ message: "Orders fetched", status: 200, success: true, data: orders });

  } catch (error) {
    return NextResponse.json({ message: "Error fetching orders: " + error, status: 500, success: false });
  }
}
