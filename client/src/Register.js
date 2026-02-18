import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 🔥 VERY IMPORTANT
    setLoading(true);

    try {
      const res = await axios.post(
        "https://booking-platform-w5pg.onrender.com/api/auth/register",
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Register response:", res.data);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.log("Register error:", err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
          "Registration failed. Try different username/email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Register</h2>

      {/* 🔥 FORM wrapper added */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          id="username"
          value={credentials.username}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="email"
          placeholder="Email"
          id="email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          id="password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;