import mongoose from "mongoose";
import { models , model } from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userid is required "],
    },
    items: [
      {
        products: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product Id is required"],
        },
        quantity: {
          type: Number,
          minlength: 1,
          default: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected" , "paid"],
      default: "pending",
      required: true,
    },
    adminNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Order = models.Order || model("Order" , OrderSchema);

export default Order ;