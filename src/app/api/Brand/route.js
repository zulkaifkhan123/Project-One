import { NextResponse } from "next/server";
import Brand from "../../../models/Brand";
import dbConnect from "../../../lib/Connection";
import Product from "../../../models/Product";

export async function POST (req) {
    await dbConnect();
    try {
        const { brandName, slug, brandDescription, brandWebsite, brandImage } = await req.json();

        if(!brandName || !slug || !brandDescription || !brandImage) {
            return NextResponse.json({
                message: "Brand name, slug, description and image are required",
                status: 400,
                success: false
            });
        }
        const existingBrand = await Brand.findOne({ brandName });
        if (existingBrand) {
            return NextResponse.json({
                message: "Brand already exists",
                status: 400,
                success: false
            });
        }
        const newBrand = new Brand({
            brandName,
            slug,
            brandDescription,
            brandWebsite,
            brandImage
        });
        await newBrand.save();

        console.log("Brand created successfully:", newBrand);
        
        return NextResponse.json({
            message: "Brand created successfully",
            status: 201,
            success: true,
            data: newBrand
        })
    } catch (error) {
        return NextResponse.json({
            message : "Error creating brand / internet Server Error"+ error.message,
            status: 500,
            success : false
        })
    }
}

export async function GET() {
    await dbConnect();
    try {
        const getBrands = await Brand.find().sort({ createdAt: -1 });
        if(getBrands.length === 0) {
            return NextResponse.json({
                message: "No brands found",
                status: 404,
                success: false
            });
        }

        let brandWithCounts = []
        for(const brand of getBrands){
            const getProductsOfSameBrand = await Product.countDocuments({brand : brand._id})
            brandWithCounts.push({
                ...brand.toObject() ,
                productCount : getProductsOfSameBrand
            })
        }

        console.log("Brands fetched successfully:", brandWithCounts);
        return NextResponse.json({
            message: "Brands fetched successfully",
            status: 200,
            success: true,
            data: brandWithCounts
        });
    } catch (error) {
        return NextResponse.json({
            message: "Error fetching brands / internet Server Error: " + error.message,
            status: 500,
            success: false
        })
    }
}