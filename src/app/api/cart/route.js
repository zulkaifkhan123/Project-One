import dbConnection from "../../../lib/Connection";
import { NextResponse } from "next/server";
import Cart from "../../../models/Cart"
import Product from "../../../models/Product";


export async function POST(req) {
  await dbConnection();

  try {
    const { userId, productId, quantity } = await req.json();

    if (!userId || !productId || !quantity) {
      return NextResponse.json({
        message: "User ID, Product ID, and quantity are required",
        status: 400,
        success: false,
      });
    }

    // ✅ Always ensure quantity is stored as a number
    let finalQuantity = Number(quantity);
    if (isNaN(finalQuantity) || finalQuantity <= 0) {
      finalQuantity = 1; // default to 1 if invalid
    }

    let existingCart = await Cart.findOne({ user: userId });

    if (existingCart) {
      const findIndex = existingCart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (findIndex > -1) {
        // update quantity
        const existingQuantity = Number(existingCart.items[findIndex].quantity) || 0;
        finalQuantity = existingQuantity + finalQuantity;

        existingCart.items[findIndex].quantity = finalQuantity;
      } else {
        // push new item
        existingCart.items.push({
          product: productId,
          quantity: finalQuantity,
        });
      }

      await existingCart.save();
    } else {
      const createCart = await Cart.create({
        user: userId,
        items: [
          {
            product: productId,
            quantity: finalQuantity,
          },
        ],
      });
      existingCart = createCart;
    }

    return NextResponse.json({
      message: "Cart updated successfully",
      status: 200,
      success: true,
      data: existingCart,
    });
  } catch (error) {
    return NextResponse.json({
      message: error.message,
      status: 500,
      success: false,
    });
  }
}


export async function GET(req) {
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

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return NextResponse.json({
        message: "Cart not found",
        status: 404,
        success: false,
      });
    }

    return NextResponse.json({
      message: "Cart fetched successfully",
      status: 200,
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({
      message: "Error fetching cart",
      status: 500,
      success: false,
      error: error.message,
    });
  }
}

export async function DELETE(req) {
  await dbConnection();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const productId = searchParams.get("productId");

    if (!userId || !productId) {
      return NextResponse.json(
        { message: "User ID and Product ID are required", success: false },
        { status: 400 }
      );
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return NextResponse.json(
        { message: "Cart not found", success: false },
        { status: 404 }
      );
    }

    // Filter out the product to delete
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    return NextResponse.json(
      { message: "Item removed successfully", success: true, cart },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", success: false, error: error.message },
      { status: 500 }
    );
  }
}

