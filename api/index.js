import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import bookingRoute from "./routes/bookings.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();

/* ================= DB CONNECTION ================= */

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

/* ================= CORS CONFIG ================= */

const allowedOrigins = [
  "http://localhost:3000",
  "https://booking-platform-frontend-green.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Handle preflight requests


/* ================= MIDDLEWARES ================= */

app.use(cookieParser());
app.use(express.json());

/* ================= ROUTES ================= */

app.get("/", (req, res) => {
  res.send("Booking Platform API is Live 🚀");
});

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/bookings", bookingRoute);

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
  });
});

/* ================= SERVER START ================= */

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
  connect();
  console.log(`🚀 Server running on port ${PORT}`);
});