import { useState } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import imageCompression from 'browser-image-compression';
import image3 from "../images/image3.png"; // ✅ Background image

function Host() {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    image: '',
    description: '',
    address: '',
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 600,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      console.log("Compressed image size:", (compressedFile.size / 1024).toFixed(2), "KB");

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Image compression error:", error);
      alert("Image compression failed.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = localStorage.getItem('userEmail');
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/addListing`, { ...formData, email });
      alert('✅ Listing added successfully!');
      setFormData({
        name: '',
        location: '',
        price: '',
        image: '',
        description: '',
        address: '',
      });
    } catch (err) {
      console.error("Submission error:", err);
      alert('❌ Error adding listing');
    }
  };

  return (
    <>
      <Navbar role="host" />

      {/* 🌈 Background same as Contact.jsx */}
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        {/* 🏞️ Image container background */}
        <div
          className="card shadow-lg p-4"
          style={{
            maxWidth: "800px",
            width: "100%",
            borderRadius: "15px",
            overflow: "hidden",
            backgroundImage: `url(${image3})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            color: "#fff",
          }}
        >
          {/* Overlay for form readability */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              zIndex: 0,
            }}
          ></div>

          {/* Form content */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 className="text-center mb-4 fw-bold" style={{ color: "#fff" }}>
              Add New Listing
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold text-light">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-light">Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-light">Price (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-light">
                  Image (under 1MB)
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="img-thumbnail mt-3"
                    style={{
                      maxWidth: '200px',
                      borderRadius: '10px',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    }}
                  />
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-light">
                  Description
                </label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  required
                  style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-light">Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                />
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn"
                  style={{
                    backgroundColor: "#8B4513",
                    color: "white",
                    fontWeight: "600",
                    borderRadius: "25px",
                    padding: "10px 0",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                  }}
                >
                  Submit Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Host;
