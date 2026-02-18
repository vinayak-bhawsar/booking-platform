import express from "express";
import { createBooking, getUserBookings } from "../controllers/booking.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Create booking
router.post("/", verifyToken, createBooking);

// Get logged-in user bookings
router.get("/my-bookings", verifyToken, getUserBookings);

export default router;