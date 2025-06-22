import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../images/logo1.png";
import axios from "axios";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setColor] = useState(null); //state to track color
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/getUser`, {
        email,
        password,
      });
      setMessage(res.data.message);
      setColor(res.status);

      if(res.status==201){
        setTimeout(() => navigate("/"), 1000); //reroute after 1 second
      }

    } catch (err) {
      if (err.response && err.response.status === 409) {
        setMessage(err.response.data.message);
        setColor(err.response.status); //get status code
      } else {
        setMessage("Registration failed");
        setColor(null);
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow w-25">
        <img
          src={logo}
          width={200}
          height={200}
          alt="Logo"
          style={{ alignSelf: "center" }}
        />
        <h4 className="card-title text-center mb-4">Signup</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="exampleInputEmail1" className="mb-3">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="exampleInputPassword1" className="mb-3">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-4">
            Submit
          </button>

          <p
            className="text-center"
            style={{ color: status == 201 ? "green" : "red" }}
          >
            {message}
          </p>

          <div className="form-group form-check mb-4 text-center">
            <label className="form-check-label" htmlFor="exampleCheck1">
              Already have an account?{" "}
              <Link to="/" style={{ color: "blue" }}>
                Login
              </Link>
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
