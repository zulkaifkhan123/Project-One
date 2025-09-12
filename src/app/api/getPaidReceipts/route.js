// app/api/receipts/route.js
import dbConnection from "../../../lib/Connection"
import Receipt from "../../../models/Recepit"
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnection();

  try {
    const receipts = await Receipt.find({ status: "paid" })
      // populate user info (from Receipt.userId)
      .populate("userId", "name email")
      // populate order details
      .populate({
        path: "orderId",
        populate: {
          path: "items.products",
          select: "productName productPrice productImage slug",
        },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        message: receipts.length
          ? "Paid receipts fetched successfully"
          : "No paid receipts found",
        data: receipts,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching paid receipts: " + error.message,
      },
      { status: 500 }
    );
  }
}
