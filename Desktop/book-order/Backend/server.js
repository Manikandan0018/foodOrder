
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
import reviewRoutes from "./routes/review.js";


dotenv.config();

const app = express();

// ✅ Correct CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (
        origin === "http://localhost:5173" ||
        /\.vercel\.app$/.test(origin)   // ✅ regex check
      ) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

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
app.use("/api/reviews", reviewRoutes);


// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ Backend is running on Render!");
});

// MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET);
