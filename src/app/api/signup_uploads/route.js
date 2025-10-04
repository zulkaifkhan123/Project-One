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
    NextResponse.json({ message: "Request received" }, { status: 200 });


    const formData = await req.formData();
    NextResponse.json({ message: "FormData parsed" , formData: !!formData}, { status: 200 });
    console.log("✅ FormData parsed:", formData ? "yes" : "no");

    const tax_id = formData.get("tax_id");
    NextResponse.json({ message: "Tax ID extracted", tax_id: !!tax_id }, { status: 200 });
    const business_licence = formData.get("business_licence");

    console.log("📂 tax_id present:", !!tax_id);
    NextResponse.json({ message: "Tax ID extracted", tax_id: !!tax_id }, { status: 200 });
    console.log("📂 business_licence present:", !!business_licence);
    NextResponse.json({ message: "Business licence extracted", business_licence: !!business_licence }, { status: 200 });

    if (!tax_id && !business_licence) {
      console.warn("⚠️ No files uploaded");
      NextResponse.json({ message: "No documents uploaded" }, { status: 400 });
      return NextResponse.json(
        { error: "No documents uploaded" },
        { status: 400 }
      );
    }

    // function for uploading a single file to cloudinary
    const uploadFile = async (file, folder) => {
      NextResponse.json({ message: `Uploading file to Cloudinary`, file: !!file, folder }, { status: 200 });
      console.log(`⬆️ Starting upload for file: ${file.name} to folder: ${folder}`);

      const arrayBuffer = await file.arrayBuffer();
      NextResponse.json({ message: "File converted to arrayBuffer", size: arrayBuffer.byteLength }, { status: 200 });
      console.log("✅ File converted to arrayBuffer, size:", arrayBuffer.byteLength);

      const buffer = Buffer.from(arrayBuffer);
      NextResponse.json({ message: "Buffer created", length: buffer.length }, { status: 200 });
      console.log("✅ Buffer created, length:", buffer.length);

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder },
          (error, result) => {
            if (error) {
              NextResponse.json({ message: "Cloudinary upload error", error: error.message }, { status: 500 });
              console.error("❌ Cloudinary upload error:", error);
              reject(error);
            } else {
              NextResponse.json({ message: "Cloudinary upload success", url: result.secure_url }, { status: 200 });
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
    NextResponse.json({ message: "Outer catch error", error: err }, { status: 500 });
    console.error("❌ Upload error (outer catch):", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
