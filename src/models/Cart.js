import mongoose from "mongoose";
import { models, model } from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "user of cart is required!"],
      ref: "Product",
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "Product in cart is required"],
          ref: "Product",
        },
        quantity: {
          type: String,
          minlength: 1,
          default: 1,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart = models.Cart || model("Cart", CartSchema);
export default Cart;
