import mongoose from "mongoose";
import { models, model } from "mongoose";

const BrandSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      required: [true, "Product name is Required"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is Required"],
      unique: true,
    },
    brandDescription: {
      type: String,
      required: [true, "Brand Description is Required"],
    },
    brandWebsite: String,
  },
  { timestamps: true }
);

BrandSchema.index({ brandName: 1 });

const Brand = models.Brand || model("Brand", BrandSchema);

export default Brand;
