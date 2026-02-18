import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    hotelId: {
      type: String,
      required: true,
    },
    hotelName: {
      type: String,
      required: true,
    },
    rooms: {
      type: Array,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      default: "confirmed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);