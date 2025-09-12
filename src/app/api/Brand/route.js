import { NextResponse } from "next/server";
import Brand from "../../../models/Brand";
import dbConnect from "../../../lib/Connection";
import Product from "../../../models/Product";

function createSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-");
}

export async function POST(req) {
  await dbConnect();
  try {
    const { brandName, brandDescription, brandWebsite } = await req.json();

    if (!brandName || !brandDescription) {
      return NextResponse.json({
        message: "Brand name and description are required",
        status: 400,
        success: false,
      });
    }

    // check if brand already exists
    const existingBrand = await Brand.findOne({ brandName });
    if (existingBrand) {
      return NextResponse.json({
        message: "Brand already exists",
        status: 400,
        success: false,
      });
    }

    // auto-generate slug from brandName
    const slug = createSlug(brandName);

    const newBrand = new Brand({
      brandName,
      slug,
      brandDescription,
      brandWebsite,
    });

    await newBrand.save();

    console.log("Brand created successfully:", newBrand);

    return NextResponse.json({
      message: "Brand created successfully",
      status: 201,
      success: true,
      data: newBrand,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Error creating brand / Internal Server Error " + error.message,
      status: 500,
      success: false,
    });
  }
}


export async function GET() {
  await dbConnect();
  try {
    const getBrands = await Brand.find().sort({ createdAt: -1 });
    if (getBrands.length === 0) {
      return NextResponse.json({
        message: "No brands found",
        status: 404,
        success: false,
      });
    }

    let brandWithDetails = [];
    for (const brand of getBrands) {
      // Get all products of the same brand
      const products = await Product.find({ brand: brand._id });

      brandWithDetails.push({
        ...brand.toObject(),
        productCount: products.length,
        products: products, // ✅ all related products
      });
    }

    console.log("Brands fetched successfully:", brandWithDetails);
    return NextResponse.json({
      message: "Brands fetched successfully",
      status: 200,
      success: true,
      data: brandWithDetails,
    });
  } catch (error) {
    return NextResponse.json({
      message:
        "Error fetching brands / Internal Server Error: " + error.message,
      status: 500,
      success: false,
    });
  }
}
