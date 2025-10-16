// src/assets/pages/HostDashboard.jsx
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import image2 from "../images/image2.png"; // ✅ background image

function HostDashboard() {
  return (
    <>
      <Navbar role="host" />

      {/* 🏞️ Full-page background with image */}
      <div
        style={{
          backgroundImage: `url(${image2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          position: "relative",
          color: "white",
          textAlign: "center",
        }}
      >
        {/* Overlay for better text visibility */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 0,
          }}
        ></div>

        {/* Main Content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 className="text-center mb-4 fw-bold" style={{ color: "#fff" }}>
            Host Dashboard
          </h2>

          <div className="d-flex justify-content-center gap-4 flex-wrap">
            {/* Add Listing Button */}
            <Link
              to="/host"
              className="btn btn-lg"
              style={{
                backgroundColor: "#8B4513", // 🤎 SaddleBrown
                color: "white",
                border: "none",
                padding: "12px 30px",
                borderRadius: "10px",
                fontWeight: "600",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#A0522D"; // lighter brown on hover
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 6px 16px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#8B4513";
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
              }}
            >
              ➕ Add New Listing
            </Link>

            {/* My Listings Button */}
            <Link
              to="/mylistings"
              className="btn btn-lg"
              style={{
                backgroundColor: "#8B4513",
                color: "white",
                border: "none",
                padding: "12px 30px",
                borderRadius: "10px",
                fontWeight: "600",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#A0522D";
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 6px 16px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#8B4513";
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
              }}
            >
              📂 My Listings
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default HostDashboard;
