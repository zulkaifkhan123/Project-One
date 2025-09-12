// app/api/signup_uploads/route.js
import { NextResponse } from "next/server";
import cloudinary from "../../../lib/cloudinary"

function bufferToStream(buffer) {
  const { Readable } = require("stream");
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const tax_id = formData.get("tax_id");
    const business_licence = formData.get("business_licence");

    if (!tax_id && !business_licence) {
      return NextResponse.json(
        { error: "No documents uploaded" },
        { status: 400 }
      );
    }

    // function for uploading a single file to cloudinary
    const uploadFile = async (file, folder) => {
      const buffer = Buffer.from(await file.arrayBuffer());

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        bufferToStream(buffer).pipe(uploadStream);
      });
    };

    // upload each doc (if provided)
    const taxIdUrl = tax_id ? await uploadFile(tax_id, "signups") : null;
    const licenseUrl = business_licence
      ? await uploadFile(business_licence, "signups")
      : null;

    return NextResponse.json(
      { success: true, taxIdUrl, licenseUrl },
      { status: 200 }
    );
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
