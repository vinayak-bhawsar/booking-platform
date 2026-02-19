import "./myBookings.css";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import { useEffect, useState } from "react";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          "https://booking-platform-w5pg.onrender.com/api/bookings/my-bookings",
          { withCredentials: true }
        );
        setBookings(res.data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="bookingContainer">
        <h1>My Bookings</h1>

        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          bookings.map((booking) => (
            <div className="bookingCard" key={booking._id}>
              <h2>{booking.hotelName}</h2>
              <p>
                <strong>Check-in:</strong>{" "}
                {new Date(booking.startDate).toDateString()}
              </p>
              <p>
                <strong>Check-out:</strong>{" "}
                {new Date(booking.endDate).toDateString()}
              </p>
              <p>
                <strong>Total Price:</strong> ${booking.totalPrice}
              </p>
              <p>
                <strong>Status:</strong> {booking.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookings;