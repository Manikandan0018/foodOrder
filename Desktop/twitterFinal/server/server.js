// server.js
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import cloudinary from 'cloudinary';
import notificationRoutes from "./routes/notification.route.js";

// Routes
import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';

//admin
import admin from './routes/Admin.js';

// chat
import chatRoutes from "./routes/chat.js";
import messageRoutes from "./routes/message.route.js";

// DB connection
import connectDB from './db/connectDB.js';

const app = express();
dotenv.config();

// Middleware
app.use(express.json(
    {
        limit:"10mb"
    }
));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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


app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});


// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute); 
app.use("/api/notifications", notificationRoutes);
app.use('/api/admin', admin); 
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);


// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});
