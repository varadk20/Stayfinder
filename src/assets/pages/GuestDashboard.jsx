import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function GuestDashboard() {
  const [details, setDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDetails, setFilteredDetails] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/getListings`)
      .then((res) => {
        setDetails(res.data);
        setFilteredDetails(res.data); // set initial filtered list
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    const filtered = details.filter((item) =>
      item.name.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      String(item.price).toLowerCase().includes(query) ||
      item.address?.toLowerCase().includes(query)
    );
    setFilteredDetails(filtered);
  };

  return (
    <>
      <Navbar role="guest" />
      <div className="container mt-4">
        {/* Search Bar */}
        <form className="d-flex justify-content-center mb-5" onSubmit={handleSearch}>
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search listings"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ maxWidth: "300px" }}
          />
          <button
            className="btn"
            type="submit"
            style={{ backgroundColor: "#E30B5C", color: "white" }}
          >
            Search
          </button>
        </form>

        {/* Listings */}
        <div className="row">
          {filteredDetails.map((detail, index) => (
            <div className="col-md-3 mb-4" key={index}>
              <div className="card" style={{ width: "18rem" }}>
                <img
                  src={detail.image}
                  alt="img"
                  className="card-img-top"
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{detail.name}</h5>
                  <p className="card-text">₹{detail.price} one night</p>
                  <Link
                    to={`/details/${detail._id}`}
                    className="btn"
                    style={{ backgroundColor: "#E30B5C", color: "white" }}
                  >
                    More Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {filteredDetails.length === 0 && (
            <p className="text-center text-muted">No listings found.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default GuestDashboard;
