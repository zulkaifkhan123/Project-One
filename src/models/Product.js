import mongoose from "mongoose";
import slugify from "slugify";

const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      trim: true,
      required: [true, "Product Name is required!"],
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    productDescription: {
      type: String,
      required: [true, "Product Description is required!"],
    },
    productPrice: {
      type: Number, 
      required: [true, "Product Price is required!"],
    },
    productImage: {
      type: [String], 
      required: [true, "Product image/logo is required!"],
    },
    productQuantity: {
      type: Number,
      required: [true, "Product Quantity is required!"],
    },
    brand: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
  },
  { timestamps: true }
);

// Automatically generate slug from productName
ProductSchema.pre("validate", function (next) {
  if (this.productName) {
    this.slug = slugify(this.productName, { lower: true, strict: true });
  }
  next();
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
