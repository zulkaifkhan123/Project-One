import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

// Save uploads in a "next_uploads" folder on Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "next_uploads",
    resource_type: "auto", // auto = images + pdfs
  },
});

// Only allow jpg, png, pdf
function fileFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/png", "application/pdf"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, and PDF files are allowed"), false);
  }
}

// Multer upload: max 5 files
const upload = multer({ storage, fileFilter }).array("files", 5);

export default upload;
