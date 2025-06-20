import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../components/Navbar";

function MyListings() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    console.log("Fetched email from localStorage:", email);
    if (!email) return;

    axios.get(`http://localhost:3000/getUserListings/${email}`)
      .then(res => setListings(res.data))
      .catch(err => console.error(err));
  }, []);

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
                  <p className="card-text">
                    ₹{listing.price} one night
                  </p>
                  <p className="card-text">
                    <strong>Location:</strong> {listing.location}
                  </p>
                  <p className="card-text">
                    {listing.description.slice(0, 60)}...
                  </p>
                  {/* Optional: Add a Details/Edit/Delete button here if needed */}
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
