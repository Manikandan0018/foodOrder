// models/Cart.js
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "ALLProduct", required: true },
    quantity: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
