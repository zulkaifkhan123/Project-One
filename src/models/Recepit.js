import mongoose from "mongoose";

const ReceiptSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      unique: true,
      default: () => new mongoose.Types.ObjectId().toString(), // auto-generate unique id
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    receiptUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Receipt =
  mongoose.models.Receipt || mongoose.model("Receipt", ReceiptSchema);

export default Receipt;
