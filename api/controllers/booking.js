import Booking from "../models/Booking.js";

// Create Booking
export const createBooking = async (req, res, next) => {
  try {
    const newBooking = new Booking({
      ...req.body,
      userId: req.user.id, // from verifyToken
    });

    const savedBooking = await newBooking.save();
    res.status(200).json(savedBooking);
  } catch (err) {
    next(err);
  }
};

// Get Logged-in User Bookings
export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id });
    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};