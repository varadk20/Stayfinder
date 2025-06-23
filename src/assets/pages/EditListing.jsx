import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import imageCompression from "browser-image-compression";

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    image: "",
    description: "",
    address: "",
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/getListingById/${id}`)
      .then((res) => {
        const { name, location, price, image, description, address } = res.data;
        setFormData({ name, location, price, image, description, address });
      })
      .catch((err) => console.error("Failed to fetch listing:", err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 0.06, // Compress to ~100KB
      maxWidthOrHeight: 400, // Resize if needed
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      console.log("Compressed size:", compressedFile.size / 1024, "KB");

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.onerror = () => {
        console.error("Error reading file:", reader.error);
        alert("Failed to read image file.");
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Compression error:", error);
      alert("Image compression failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/updateListing/${id}`,
        formData
      );
      alert("Listing updated successfully!");
      navigate("/mylistings");
    } catch (err) {
      console.error("Update failed:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Unknown error";
      alert(`Error updating listing: ${errorMessage}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="card shadow p-4">
          <h2 className="mb-4 text-center">Edit Listing</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Price (₹)</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                Image (leave blank to keep current)
              </label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="img-thumbnail mt-2"
                  style={{ maxWidth: "200px" }}
                />
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="d-grid">
              <button
                type="submit"
                className="btn"
                style={{ backgroundColor: "#E30B5C", color: "white" }}
              >
                Update Listing
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditListing;
