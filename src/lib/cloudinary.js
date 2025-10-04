// lib/cloudinary.js
// Purpose: Configure Cloudinary once and reuse it everywhere.

// Import Cloudinary v2 SDK
import { v2 as cloudinary } from "cloudinary";

// Load credentials from environment variables for security.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY,       // Your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Your Cloudinary API secret
});

console.log("Cloudinary config loaded:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "present" : "missing",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "present" : "missing",
});

// Export a single configured instance for reuse in routes/services.
export default cloudinary;
