import { NextResponse } from "next/server";
import Product from "../../../models/Product";
import dbConnection from "../../../lib/Connection";
import Brand from "../../../models/Brand";

export async function POST(req) {
  await dbConnection();
  try {
    const { productName, productDescription, productPrice, productImage, productQuantity, brand } = await req.json();

    if (!productName || !productDescription || !productPrice || !productImage || !productQuantity || !brand) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }

    const slug = productName.toLowerCase().trim().replace(/\s+/g, "-");

    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json(
        { message: "Product with this name already exists", success: false },
        { status: 400 }
      );
    }

    const formattedImages = Array.isArray(productImage) ? productImage : [productImage];

    const newProduct = await Product.create({
      productName,
      slug,
      productDescription,
      productPrice,
      productImage: formattedImages,
      productQuantity,
      brand
    });

    console.log("Product created successfully:", newProduct);
    return NextResponse.json(
      { message: "Product created successfully", success: true, data: newProduct },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error / failed to create product: " + error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnection();
  try {
    const products = await Product.find().populate("brand").sort({ createdAt: -1 });
    if (products.length === 0) {
      return NextResponse.json(
        { message: "No products found", success: false },
        { status: 404 }
      );
    }
    console.log("Products fetched successfully:", products);

    return NextResponse.json({
      message: "Products fetched successfully",
      success: true,
      data: products
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({
      success : false,
      message: "Internal Server Error / failed to fetch products: " + error.message },
      { status: 500 }
    );  
  }
}