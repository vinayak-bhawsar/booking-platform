import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Login from "./pages/login/Login";

function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Main Hotels Routes */}
      <Route path="/hotels" element={<List type="stays" />} />
      <Route path="/hotels/:id" element={<Hotel />} />

      {/* Category Dynamic Routes */}
      <Route path="/stays" element={<List type="stays" />} />
      <Route path="/flights" element={<List type="flights" />} />
      <Route path="/cars" element={<List type="cars" />} />
      <Route path="/attractions" element={<List type="attractions" />} />
      <Route path="/taxis" element={<List type="taxis" />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;