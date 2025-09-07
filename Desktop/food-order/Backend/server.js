
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import AllProductRoutes from "./routes/AllProduct.js";
import DashboardRoutes from "./routes/Dashboard.js";
import userRoutes from "./routes/userLogin.js";
import cart from "./routes/cart.js";
import favoriteRoutes from "./routes/likedItems.js";
import address from "./routes/address.js";
import order from "./routes/order.js";
import AdminOrder from "./routes/adminOrder.js";
import sms from "./routes/sms.js";
import restaurantRoutes from "./routes/NearHotel.js";


dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, // if you send cookies or authorization headers
}));

app.use(express.json());

// Routes
app.use("/api/AllProduct", AllProductRoutes);
app.use("/api/dashboard", DashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cart);
app.use("/api/favorite", favoriteRoutes);
app.use("/api/address", address);
app.use("/api/orders", order);
app.use("/api/AdminOrder", AdminOrder);
app.use("/api/sms", sms);
app.use("/api/restaurants", restaurantRoutes);


// MongoDB Connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
  });

console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET);
