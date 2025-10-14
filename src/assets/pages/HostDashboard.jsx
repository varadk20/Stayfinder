// src/assets/pages/HostDashboard.jsx

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function HostDashboard() {
  return (
    <>
      <Navbar role="host" />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Host Dashboard</h2>
        <div className="d-flex justify-content-center gap-4">
          <Link 
            to="/host" 
            className="btn btn-lg" 
            style={{ backgroundColor: "#E30B5C", color: "white" }}
          >
            ➕ Add New Listing
          </Link>
          <Link 
            to="/mylistings" 
            className="btn btn-lg" 
            style={{ backgroundColor: "#E30B5C", color: "white" }}
          >
            📂 My Listings
          </Link>
        </div>
      </div>
    </>
  );
}

export default HostDashboard;
