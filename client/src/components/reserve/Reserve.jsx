import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Reserve = ({ setOpen, hotelId, hotel }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);

  const { data } = useFetch(`/hotels/room/${hotelId}`);
  const { dates } = useContext(SearchContext) || {};
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

  const dayDifference = (date1, date2) => {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
  };

  /* ================= SAFE DATE HANDLING ================= */

  let startDate = null;
  let endDate = null;
  let days = 1;
  let alldates = [];

  if (dates && Array.isArray(dates) && dates.length > 0) {
    startDate = dates[0]?.startDate;
    endDate = dates[0]?.endDate;

    if (startDate && endDate) {
      days = dayDifference(new Date(startDate), new Date(endDate));

      const start = new Date(startDate);
      const end = new Date(endDate);
      const date = new Date(start.getTime());

      while (date <= end) {
        alldates.push(new Date(date).getTime());
        date.setDate(date.getDate() + 1);
      }
    }
  }

  /* ====================================================== */

  const isAvailable = (roomNumber) => {
    if (!roomNumber.unavailableDates) return true;

    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );

    return !isFound;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;

    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  const handleClick = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    // 🔥 IMPORTANT VALIDATION
    if (!startDate || !endDate) {
      alert("Please select dates first from search page.");
      navigate("/");
      return;
    }

    if (selectedRooms.length === 0) {
      alert("Please select at least one room.");
      return;
    }

    try {
      // 1️⃣ Update room availability
      await Promise.all(
        selectedRooms.map((roomId) =>
          axios.put(
            `https://booking-platform-w5pg.onrender.com/api/rooms/availability/${roomId}`,
            { dates: alldates },
            { withCredentials: true }
          )
        )
      );

      // 2️⃣ Save booking
      const totalPrice =
        days *
        selectedRooms.length *
        (data?.[0]?.price || 0);

      await axios.post(
        "https://booking-platform-w5pg.onrender.com/api/bookings",
        {
          hotelId,
          hotelName: hotel?.name,
          rooms: selectedRooms,
          totalPrice,
          startDate,
          endDate,
        },
        { withCredentials: true }
      );

      alert("Booking successful 🎉");
      setOpen(false);
      navigate("/my-bookings");

    } catch (err) {
      console.log(err);
      alert("Booking failed");
    }
  };

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />

        <span>Select your rooms:</span>

        {data?.map((item) => (
          <div className="rItem" key={item._id}>
            <div className="rItemInfo">
              <div className="rTitle">{item.title}</div>
              <div className="rDesc">{item.desc}</div>
              <div className="rMax">
                Max people: <b>{item.maxPeople}</b>
              </div>
              <div className="rPrice">${item.price}</div>
            </div>

            <div className="rSelectRooms">
              {item.roomNumbers?.map((roomNumber) => (
                <div className="room" key={roomNumber._id}>
                  <label>{roomNumber.number}</label>
                  <input
                    type="checkbox"
                    value={roomNumber._id}
                    onChange={handleSelect}
                    disabled={!isAvailable(roomNumber)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button onClick={handleClick} className="rButton">
          Reserve Now!
        </button>
      </div>
    </div>
  );
};

export default Reserve;