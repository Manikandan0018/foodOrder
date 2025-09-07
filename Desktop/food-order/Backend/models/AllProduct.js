import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String, required: true },
  imageUrl: { type: String },       // Cloudinary image URL
  imageId: { type: String },        // Cloudinary public_id
}, { timestamps: true });

export default mongoose.model("ALLProduct", productSchema);
