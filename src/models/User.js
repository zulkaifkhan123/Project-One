import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  business_name: {
    type: String,
    required: true,
    trim: true,
  },

  tax_id: {
    type: String,
    required: true,
  },

  business_licence: {
    type: String,
    required: true,
  },

  phone_number: {
    type: String,
    required: true,
    match: [/^\+?[0-9]{7,15}$/, "Please enter a valid phone number"],
  },
  website: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
  billing_address: {
    type: String,
    required: true,
  },
  shipping_address: {
    type: String,
    required: true,
  },
  account_status: {
    type: String,
    enum: ["pending", "suspended", "approved"],
    default: "pending",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verification_code: {
    type: String,
    minlength: 6,
    maxlength: 6,
  },
  code_expiry: {
    type: Date,
  },
});

// Remove password from JSON responses
UserSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
