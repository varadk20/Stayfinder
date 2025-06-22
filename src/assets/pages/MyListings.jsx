import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../components/Navbar";
import { FaTrash, FaEdit } from 'react-icons/fa'; // font awesome icons
import { useNavigate } from 'react-router-dom';

function MyListings() {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/getUserListings/${email}`)
      .then(res => setListings(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/deleteListing/${id}`);
      setListings(prev => prev.filter(listing => listing._id !== id));
    } catch (err) {
      console.error("Error deleting listing:", err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-listing/${id}`); // assumes you have a route/page for editing
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h3 className="text-center mb-5">My Listings</h3>
        <div className="row">
          {listings.map((listing, index) => (
            <div className="col-md-3 mb-4" key={index}>
              <div className="card" style={{ width: "18rem" }}>
                <img
                  src={listing.image}
                  alt="listing"
                  className="card-img-top"
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{listing.name}</h5>
                  <p className="card-text">₹{listing.price} one night</p>
                  <p className="card-text"><strong>Location:</strong> {listing.location}</p>
                  <p className="card-text">{listing.description.slice(0, 60)}...</p>

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-md btn-outline-primary"
                      onClick={() => handleEdit(listing._id)}
                    >
                      <FaEdit /> 
                    </button>
                    <button
                      className="btn btn-md btn-outline-danger"
                      onClick={() => handleDelete(listing._id)}
                    >
                      <FaTrash /> 
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MyListings;
