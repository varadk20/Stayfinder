import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import StarDisplay from "../components/StarDisplay"; // ⭐ import reusable star display

function Home() {
  const [details, setDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [minRating, setMinRating] = useState(0); // optional rating filter

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/getListings`)
      .then((res) => {
        setDetails(res.data || []);
        setFilteredDetails(res.data || []);
      })
      .catch((err) => console.error(err));
  }, []);

  // 🔍 Search logic
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    const filtered = details.filter((item) =>
      (item.name || "").toLowerCase().includes(query) ||
      (item.location || "").toLowerCase().includes(query) ||
      (item.description || "").toLowerCase().includes(query) ||
      String(item.price || "").toLowerCase().includes(query) ||
      (item.address || "").toLowerCase().includes(query)
    );
    setFilteredDetails(filtered);
  };

  // ⭐ Apply rating filter before rendering
  const visibleListings = filteredDetails.filter(
    (item) => (item.averageRating || 0) >= minRating
  );

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        {/* 🔎 Search bar */}
        <form
          className="d-flex justify-content-center mb-4"
          onSubmit={handleSearch}
        >
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

        {/* ⭐ Optional rating filter */}
        <div className="d-flex justify-content-center mb-4">
          <label className="me-2 fw-bold">Minimum Rating:</label>
          <select
            className="form-select"
            style={{ maxWidth: "120px" }}
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
          >
            <option value={0}>Any</option>
            <option value={1}>1+</option>
            <option value={2}>2+</option>
            <option value={3}>3+</option>
            <option value={4}>4+</option>
            <option value={5}>5</option>
          </select>
        </div>

        {/* 🏨 Hotel cards */}
        <div className="row">
          {visibleListings.map((detail, index) => (
            <div className="col-md-3 mb-4" key={detail._id || index}>
              <div className="card shadow-sm" style={{ width: "18rem" }}>
                <img
                  src={detail.image}
                  alt={detail.name || "listing image"}
                  className="card-img-top"
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{detail.name}</h5>

                  {/* ⭐ Average rating */}
                  <div style={{ marginBottom: "6px" }}>
                    <StarDisplay
                      value={detail.averageRating || 0}
                      size={16}
                      showNumber={true}
                    />
                    <small className="text-muted d-block">
                      {detail.reviews?.length
                        ? `(${detail.reviews.length} review${detail.reviews.length > 1 ? "s" : ""})`
                        : "No reviews yet"}
                    </small>
                  </div>

                  <p className="card-text text-muted mb-2">
                    ₹{detail.price} / night
                  </p>

                  <Link
                    to={`/details/${detail._id}`}
                    className="btn w-100"
                    style={{
                      backgroundColor: "#E30B5C",
                      color: "white",
                      fontWeight: "500",
                    }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {visibleListings.length === 0 && (
            <p className="text-center text-muted">No listings found.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
//ezekiel ratings