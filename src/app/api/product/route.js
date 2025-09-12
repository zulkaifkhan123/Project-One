import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "../../../models/Product";
import dbConnection from "../../../lib/Connection";
import Brand from "../../../models/Brand"

export async function POST(req) {
  await dbConnection();

  try {
    const body = await req.json(); // ✅ frontend sends JSON, not formData

    const data = {
      productName: body.productName,
      productDescription: body.productDescription,
      productPrice: Number(body.productPrice),
      productQuantity: Number(body.productQuantity),
      brand: body.brand,
      productImage: body.productImage, // ✅ directly store URLs
    };

    console.log("✅ Received Data:", data);

    // Validation
    if (
      !data.productName ||
      !data.productDescription ||
      !data.productPrice ||
      !data.productQuantity ||
      !data.brand
    ) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }

    if (data.productImage.length < 3 || data.productImage.length > 5) {
      return NextResponse.json(
        { message: "You must upload between 3 and 5 images", success: false },
        { status: 400 }
      );
    }

    const slug = data.productName.toLowerCase().trim().replace(/\s+/g, "-");

    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json(
        { message: "Product with this name already exists", success: false },
        { status: 400 }
      );
    }

    const newProduct = await Product.create({
      productName: data.productName,
      slug,
      productDescription: data.productDescription,
      productPrice: data.productPrice,
      productQuantity: data.productQuantity,
      brand: new mongoose.Types.ObjectId(data.brand),
      productImage: data.productImage, // ✅ save URLs directly
    });

    return NextResponse.json(
      { message: "Product created successfully", success: true, data: newProduct },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error: " + error.message },
      { status: 500 }
    );
  }
}


export async function GET() {
  await dbConnection();
  try {
    const products = await Product.find()
      .populate("brand")
      .sort({ createdAt: -1 });

    if (products.length === 0) {
      return NextResponse.json(
        { message: "No products found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Products fetched successfully",
        success: true,
        data: products,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Internal Server Error / failed to fetch products: " + error.message,
      },
      { status: 500 }
    );
  }
}
