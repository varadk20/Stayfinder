import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../images/logo1.png';
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
        localStorage.setItem('userEmail', email); // Save login email
        setTimeout(() => navigate('/home'), 1000); // redirect to home
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
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow w-25">
        <img src={logo} width={200} height={200} alt="Logo" style={{ alignSelf: 'center' }} />
        <h4 className="card-title text-center mb-4">Login</h4>
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label htmlFor="loginEmail" className='mb-3'>Email address</label>
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
            <label htmlFor="loginPassword" className='mb-3'>Password</label>
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

          <button type="submit" className="btn btn-primary w-100 mb-4">
            Submit
          </button>

          <p className="text-center" style={{ color: status === 200 ? 'green' : 'red' }}>
            {message}
          </p>

          <div className="form-group form-check mb-4 text-center">
            <label className="form-check-label" htmlFor="exampleCheck1">
              Don't have an account?
              <Link to='/signup' style={{ color: 'blue' }}> Register</Link>
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
