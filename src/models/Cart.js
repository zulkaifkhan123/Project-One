import mongoose, { models, model } from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User of cart is required!"],
      ref: "User",  
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "Product in cart is required"],
          ref: "Product",  
        },
        quantity: {
          type: Number,      
          min: 1,
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
