import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createHotel = async (req, res, next) => {
  try {
    const newHotel = new Hotel(req.body);
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getHotels = async (req, res, next) => {
  const { min, max, sort, page = 1, limit = 5, ...others } = req.query;

  try {
    const skip = (page - 1) * limit;

    const hotels = await Hotel.find({
      ...others,
      cheapestPrice: {
        $gt: Number(min) || 1,
        $lt: Number(max) || 999,
      },
    })
      .sort(
        sort === "price_asc"
          ? { cheapestPrice: 1 }
          : sort === "price_desc"
          ? { cheapestPrice: -1 }
          : sort === "rating_desc"
          ? { rating: -1 }
          : {}
      )
      .skip(skip)
      .limit(Number(limit));

    const total = await Hotel.countDocuments({
      ...others,
      cheapestPrice: {
        $gt: Number(min) || 1,
        $lt: Number(max) || 999,
      },
    });

    res.status(200).json({
      hotels,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
    });

  } catch (err) {
    next(err);
  }
};

export const countByCity = async (req, res, next) => {
  try {
    if (!req.query.cities) {
      return res.status(400).json({ message: "Cities query missing" });
    }

    const cities = req.query.cities.split(",");

    const list = await Promise.all(
      cities.map((city) =>
        Hotel.countDocuments({ city: city })
      )
    );

    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

export const countByType = async (req, res, next) => {
  try {
    const types = ["hotel", "apartment", "resort", "villa", "cabin"];

    const counts = await Promise.all(
      types.map((type) =>
        Hotel.countDocuments({ type })
      )
    );

    const result = types.map((type, i) => ({
      type,
      count: counts[i],
    }));

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const list = await Promise.all(
      hotel.rooms.map((room) => Room.findById(room))
    );

    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};