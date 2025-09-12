import { NextResponse } from "next/server";
import dbConnection from "../../../lib/Connection"; // your MongoDB connection
import Cart from "../../../models/Cart";

export async function DELETE(req) {
  await dbConnection();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({
        message: "User ID is required",
        status: 400,
        success: false,
      });
    }

    const cart = await Cart.findOneAndDelete({ user: userId });

    if (!cart) {
      return NextResponse.json({
        message: "No cart found to delete",
        status: 404,
        success: false,
      });
    }

    return NextResponse.json({
      message: "Cart cleared successfully",
      status: 200,
      success: true,
      data: cart,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error clearing cart: " + error.message,
      status: 500,
      success: false,
    });
  }
}
