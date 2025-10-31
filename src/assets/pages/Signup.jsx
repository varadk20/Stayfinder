import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../images/logo1.png";
import image4 from "../images/image4.png"; // background image
import axios from "axios";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setColor] = useState(null);
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/getUser`, {
        email,
        password,
        role,
        phone, // ✅ kept your phone field
      });
      setMessage(res.data.message);
      setColor(res.status);

      if (res.status === 201) {
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setMessage(err.response.data.message);
        setColor(err.response.status);
      } else {
        setMessage("Registration failed");
        setColor(null);
      }
    }
  };

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          backgroundImage: `url(${image4})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          padding: "2rem",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            zIndex: 0,
          }}
        />

        <div
          className="card p-4 shadow"
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "420px",
            background: "rgba(255,255,255,0.94)",
            borderRadius: 12,
          }}
        >
          <div className="d-flex justify-content-center mb-3">
            <img
              src={logo}
              alt="Logo"
              style={{ maxWidth: 140, height: "auto", objectFit: "contain" }}
            />
          </div>

          <h4 className="card-title text-center mb-4">Signup</h4>

          {/* ✅ form starts here */}
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="signupEmail" className="mb-2">
                Email address
              </label>
              <input
                id="signupEmail"
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="signupPassword" className="mb-2">
                Password
              </label>
              <input
                id="signupPassword"
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* ✅ Added your phone number field */}
            <div className="form-group mb-3">
              <label htmlFor="signupPhone" className="mb-2">
                Phone Number
              </label>
              <input
                id="signupPhone"
                type="tel"
                className="form-control"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                pattern="[0-9]{10}"
                title="Please enter a 10-digit phone number"
              />
            </div>

            <div className="form-group mb-4">
              <label className="mb-2">Role</label>
              <select
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select Role</option>
                <option value="guest">Guest</option>
                <option value="host">Host</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn w-100 mb-3"
              style={{
                backgroundColor: "#8B4513",
                color: "white",
                fontWeight: 600,
                borderRadius: 8,
                padding: "10px 0",
              }}
            >
              Submit
            </button>

            <p className="text-center mb-0" style={{ color: status === 201 ? "green" : "red" }}>
              {message}
            </p>

            <div className="form-group form-check mt-3 text-center">
              <span>Already have an account? </span>
              <Link to="/" style={{ color: "#E30B5C", fontWeight: 600 }}>
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
