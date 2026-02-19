import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

// ✅ Create Hotel
export const createHotel = async (req, res, next) => {
  try {
    const newHotel = new Hotel(req.body);
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
};

// ✅ Update Hotel
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

// ✅ Delete Hotel
export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted.");
  } catch (err) {
    next(err);
  }
};

// ✅ Get Single Hotel
export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};

// ✅ Get Hotels (FILTER + SORT + PAGINATION)
export const getHotels = async (req, res, next) => {
  try {
    const {
      min,
      max,
      sort,
      page = 1,
      pageSize = 5,
      ...filters
    } = req.query;

    // 🔥 Build Clean Filter
    const queryFilter = {
      ...filters,
      cheapestPrice: {
        $gt: min ? Number(min) : 1,
        $lt: max ? Number(max) : 999999,
      },
    };

    const skip = (Number(page) - 1) * Number(pageSize);

    let query = Hotel.find(queryFilter);

    // ✅ Sorting
    if (sort === "price_asc") {
      query = query.sort({ cheapestPrice: 1 });
    } else if (sort === "price_desc") {
      query = query.sort({ cheapestPrice: -1 });
    } else if (sort === "rating") {
      query = query.sort({ rating: -1 });
    }

    const hotels = await query
      .skip(skip)
      .limit(Number(pageSize));

    const total = await Hotel.countDocuments(queryFilter);

    res.status(200).json({
      total,
      currentPage: Number(page),
      totalPages:  Math.ceil(total / Number(pageSize)),
      hotels,
    });

  } catch (err) {
    next(err);
  }
};

// ✅ Count By City
export const countByCity = async (req, res, next) => {
  try {
    if (!req.query.cities) {
      return res.status(400).json({ message: "Cities query missing" });
    }

    const cities = req.query.cities.split(",");

    const list = await Promise.all(
      cities.map((city) =>
        Hotel.countDocuments({ city })
      )
    );

    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

// ✅ Count By Type
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

// ✅ Get Hotel Rooms
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