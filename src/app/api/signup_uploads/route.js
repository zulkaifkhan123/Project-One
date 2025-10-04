// app/api/signup_uploads/route.js
import { NextResponse } from "next/server";
import cloudinary from "../../../lib/cloudinary";

// ✅ Force Node runtime (needed for Buffer/Streams + Cloudinary SDK)
export const runtime = "nodejs";

function bufferToStream(buffer) {
  const { Readable } = require("stream");
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

export async function POST(req) {
  try {
    console.log("➡️ [API] /api/signup_uploads POST request received");

    const formData = await req.formData();
    console.log("✅ FormData parsed:", formData ? "yes" : "no");

    const tax_id = formData.get("tax_id");
    const business_licence = formData.get("business_licence");

    console.log("📂 tax_id present:", !!tax_id);
    console.log("📂 business_licence present:", !!business_licence);

    if (!tax_id && !business_licence) {
      console.warn("⚠️ No files uploaded");
      return NextResponse.json(
        { error: "No documents uploaded" },
        { status: 400 }
      );
    }

    // function for uploading a single file to cloudinary
    const uploadFile = async (file, folder) => {
      console.log(`⬆️ Starting upload for file: ${file.name} to folder: ${folder}`);

      const arrayBuffer = await file.arrayBuffer();
      console.log("✅ File converted to arrayBuffer, size:", arrayBuffer.byteLength);

      const buffer = Buffer.from(arrayBuffer);
      console.log("✅ Buffer created, length:", buffer.length);

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder },
          (error, result) => {
            if (error) {
              console.error("❌ Cloudinary upload error:", error);
              reject(error);
            } else {
              console.log("✅ Cloudinary upload success:", result.secure_url);
              resolve(result.secure_url);
            }
          }
        );

        bufferToStream(buffer).pipe(uploadStream);
      });
    };

    // upload each doc (if provided)
    const taxIdUrl = tax_id ? await uploadFile(tax_id, "signups") : null;
    const licenseUrl = business_licence ? await uploadFile(business_licence, "signups") : null;

    console.log("✅ Final URLs:", { taxIdUrl, licenseUrl });

    return NextResponse.json(
      { success: true, taxIdUrl, licenseUrl },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Upload error (outer catch):", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
