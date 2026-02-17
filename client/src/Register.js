import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://booking-platform-w5pg.onrender.com/api/auth/register",
        credentials
      );
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        id="username"
        onChange={handleChange}
      />
      <br /><br />
      <input
        type="email"
        placeholder="Email"
        id="email"
        onChange={handleChange}
      />
      <br /><br />
      <input
        type="password"
        placeholder="Password"
        id="password"
        onChange={handleChange}
      />
      <br /><br />
      <button onClick={handleClick}>Register</button>
    </div>
  );
};

export default Register;