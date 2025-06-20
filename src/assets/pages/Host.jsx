import { useState } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';

function Host() {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    image: '',
    description: '',
    address: '',
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert('Image size must be less than 1MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = localStorage.getItem('userEmail'); // get from login
      await axios.post('http://localhost:3000/addListing', {...formData, email:email});
      alert('Listing added successfully!');
      setFormData({
        name: '',
        location: '',
        price: '',
        image: '',
        description: '',
        address: '',
      });
    } catch (err) {
      console.error(err);
      alert('Error adding listing');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="card shadow p-4">
          <h2 className="mb-4 text-center">Add New Listing</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Price (₹)</label>
              <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Image (under 1MB)</label>
              <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} required />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="img-thumbnail mt-2"
                  style={{ maxWidth: '200px' }}
                />
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="3" required></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn" style={{
                width: "100%",
                backgroundColor: "#E30B5C",
                color: "white",
              }}>Submit Listing</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Host;
