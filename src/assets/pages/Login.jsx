import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../images/logo1.png';
import image4 from '../images/image4.png'; // background image
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        email,
        password
      });

      setMessage(res.data.message);
      setStatus(res.status);

      if (res.status === 200) {
        // Save login info
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', res.data.role);

        // Redirect based on role
        setTimeout(() => {
          if (res.data.role === "host") {
            navigate('/hostDashboard');
          } else if (res.data.role === "guest") {
            navigate('/guestDashboard');
          }
        }, 1000);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setMessage(err.response.data.message);
        setStatus(401);
      } else {
        setMessage('Login failed');
        setStatus(null);
      }
    }
  };

  return (
    <>
      {/* Full-page background */}
      <div
        style={{
          minHeight: '100vh',
          backgroundImage: `url(${image4})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '2rem',
        }}
      >
        {/* dark overlay for contrast */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            zIndex: 0,
          }}
        />

        {/* login card */}
        <div
          className="card p-4 shadow"
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: '420px',
            background: 'rgba(255,255,255,0.94)',
            borderRadius: '12px',
          }}
        >
          <div className="d-flex justify-content-center mb-3">
            <img
              src={logo}
              alt="Logo"
              style={{ maxWidth: 140, height: 'auto', objectFit: 'contain' }}
            />
          </div>

          <h4 className="card-title text-center mb-4">Login</h4>

          <form onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <label htmlFor="loginEmail" className="mb-2">Email address</label>
              <input
                type="email"
                className="form-control"
                id="loginEmail"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="loginPassword" className="mb-2">Password</label>
              <input
                type="password"
                className="form-control"
                id="loginPassword"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn w-100 mb-3"
              style={{
                backgroundColor: '#8B4513', // brown theme button
                color: 'white',
                fontWeight: 600,
                borderRadius: 8,
                padding: '10px 0',
              }}
            >
              Submit
            </button>

            <p className="text-center mb-0" style={{ color: status === 200 ? 'green' : 'red' }}>
              {message}
            </p>

            <div className="form-group form-check mt-3 text-center">
              <span>Don't have an account? </span>
              <Link to="/signup" style={{ color: '#E30B5C', fontWeight: 600 }}>
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
