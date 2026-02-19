import mongoose from "mongoose";

const roomNumberSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
    },
    unavailableDates: {
      type: [Date],
      default: [],
    },
  },
  { _id: true }
);

const RoomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Room title is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    price: {
      type: Number,
      required: [true, "Room price is required"],
      min: [0, "Price cannot be negative"],
    },

    maxPeople: {
      type: Number,
      required: [true, "Max people is required"],
      min: [1, "At least 1 person allowed"],
    },

    desc: {
      type: String,
      required: [true, "Room description is required"],
      trim: true,
      maxlength: 1000,
    },

    roomNumbers: {
      type: [roomNumberSchema],
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "At least one room number is required",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster price filtering later
RoomSchema.index({ price: 1 });

export default mongoose.model("Room", RoomSchema);