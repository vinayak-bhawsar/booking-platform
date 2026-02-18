import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();

// ✅ MongoDB Connection Function
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("✅ Connected to mongoDB.");
  } catch (error) {
    console.log("❌ MongoDB connection failed:", error);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ mongoDB disconnected!");
});

// ✅ Middlewares
app.use(
  cors({
    origin: "https://booking-platform-frontend-green.vercel.app",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Booking Platform API is Live 🚀");
});
app.get("/test-auth", (req, res) => {
  res.send("Auth route working");
});

// ✅ Routes
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

// ✅ Error Handler
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
  });
});

const PORT = process.env.PORT || 8800;

// ✅ VERY IMPORTANT — Call connect() when server starts
app.listen(PORT, () => {
  connect(); // 🔥 THIS WAS MISSING
  console.log(`🚀 Server running on port ${PORT}`);
});