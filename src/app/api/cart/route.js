import dbConnection from "../../../lib/Connection";
import { NextResponse } from "next/server";
import Cart from "../../../models/Cart";
import { URL } from "url";
import Product from "../../../models/Product";

export async function POST(req) {
    await dbConnection();
    try {
        const { userId, productId, quantity } = await req.json();

        if (!userId || !productId || !quantity) {
            return NextResponse.json({
                message: "User ID, Product ID, and quantity are required",
                status: 400,
                success: false
            });
        }
        const existingCart = await Cart.findOne({ user: userId });

        if(existingCart){
            const findIndex = existingCart.items.findIndex((item)=>{
                return item.product.toString() === productId
            })
            if(findIndex > -1){
                existingCart.items[findIndex].quantity += quantity
            } else {
                existingCart.items.push({ product: productId, quantity });
            }
            await existingCart.save();
            console.log("Cart updated successfully:", existingCart);
            return NextResponse.json({
                message: "Product added to existing cart successfully",
                status: 200,
                success: true,
                data: existingCart
            });
        } else {
            const createCart = await Cart.create({
                user : userId, 
                items : [{
                    product: productId,
                    quantity: quantity
                }]
            })
            return NextResponse.json({
                message: "Product added to cart successfully",
                status: 201,
                success: true,
                data: createCart
            })
        }

       
    } catch (error) {
        return NextResponse.json({
            message: "Error adding to cart / internet Server Error: " + error.message,
            status: 500,
            success: false
        })
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
                success: false
            });
        }

        const getCart = await Cart.findOne({ user: userId })
            .populate("items.product")
            .sort({ createdAt: -1 });

        if (getCart.length < 1) {
            return NextResponse.json({
                message: "Cart does not have products",
                status: 404,
                success: false
            });
        }

        if (!getCart) {
            return NextResponse.json({
                message: "Cart not found for the user",
                status: 404,
                success: false
            });
        }

        console.log("Cart fetched successfully:", getCart);
        
        return NextResponse.json({
            message: "Cart fetched successfully",
            status: 200,
            success: true,
            data: getCart
        });

    } catch (error) {
        return NextResponse.json({
            message: "Error fetching cart / internal Server Error: " + error.message,
            status: 500,
            success: false
        });
    }
}
