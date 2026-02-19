import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Login from "./pages/login/Login";
import Register from "./Register";
import MyBookings from "./pages/myBookings/MyBookings";

function App() {
  return (
    <Routes>
      {/* 🔥 Home */}
      <Route path="/" element={<Home />} />

      {/* 🔥 Hotels */}
      <Route path="/hotels" element={<List type="stays" />} />
      <Route path="/hotels/:id" element={<Hotel />} />

      {/* 🔥 Category Routes */}
      <Route path="/stays" element={<List type="stays" />} />
      <Route path="/flights" element={<List type="flights" />} />
      <Route path="/cars" element={<List type="cars" />} />
      <Route path="/attractions" element={<List type="attractions" />} />
      <Route path="/taxis" element={<List type="taxis" />} />

      {/* 🔥 Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/my-bookings" element={<MyBookings />} />

      {/* 🔥 Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;