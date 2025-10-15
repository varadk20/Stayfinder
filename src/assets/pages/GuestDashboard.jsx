// src/pages/GuestDashboard.jsx
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import StarDisplay from "../components/StarDisplay";

function GuestDashboard() {
  const [details, setDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [locationFilter, setLocationFilter] = useState("Any");
  const [minRating, setMinRating] = useState(0);
  const [priceSort, setPriceSort] = useState("none");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/getListings`)
      .then((res) => {
        setDetails(res.data || []);
      })
      .catch((err) => console.error(err));
  }, []);

  const visibleListings = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();
    let list = details.filter((item) => {
      if (!item) return false;
      const name = (item.name || "").toLowerCase();
      const loc = (item.location || "").toLowerCase();
      const desc = (item.description || "").toLowerCase();
      const price = String(item.price || "").toLowerCase();
      const address = (item.address || "").toLowerCase();
      return (
        name.includes(q) ||
        loc.includes(q) ||
        desc.includes(q) ||
        price.includes(q) ||
        address.includes(q)
      );
    });

    if (locationFilter && locationFilter !== "Any") {
      const target = locationFilter.toLowerCase();
      list = list.filter((item) =>
        (item.location || "").toLowerCase().includes(target)
      );
    }

    list = list.filter((item) => {
      const avg = Number(item.averageRating || 0);
      return avg >= Number(minRating || 0);
    });

    if (priceSort === "low-high") {
      list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (priceSort === "high-low") {
      list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    return list;
  }, [details, searchQuery, locationFilter, minRating, priceSort]);

  return (
    <>
      <Navbar role="guest" />

      {/* 🌈 Background Wrapper */}
      <div
        style={{
          background: "linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)",
          minHeight: "100vh",
          padding: "3rem 0",
        }}
      >
        <div className="container mt-4">
          {/* 🔍 Search + Filters Row */}
          <div className="mb-4">
            <form
              className="d-flex justify-content-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search listings"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ maxWidth: "360px" }}
              />
              <button
                className="btn"
                type="button"
                onClick={() => setSearchQuery("")}
                style={{
                  backgroundColor: "#E30B5C",
                  color: "white",
                  marginLeft: 8,
                }}
              >
                Clear
              </button>
            </form>

            {/* Filters */}
            <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
              {/* Location filter */}
              <div>
                <label className="form-label mb-1">Location</label>
                <select
                  className="form-select"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  style={{ minWidth: 160 }}
                >
                  <option value="Any">Any</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                </select>
              </div>

              {/* Price sort */}
              <div>
                <label className="form-label mb-1">Price</label>
                <select
                  className="form-select"
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value)}
                  style={{ minWidth: 160 }}
                >
                  <option value="none">Default</option>
                  <option value="low-high">Low → High</option>
                  <option value="high-low">High → Low</option>
                </select>
              </div>

              {/* Rating filter */}
              <div>
                <label className="form-label mb-1">Minimum Rating</label>
                <select
                  className="form-select"
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  style={{ minWidth: 160 }}
                >
                  <option value={0}>Any</option>
                  <option value={1}>1+</option>
                  <option value={2}>2+</option>
                  <option value={3}>3+</option>
                  <option value={4}>4+</option>
                  <option value={5}>5</option>
                </select>
              </div>

              {/* Reset filters */}
              <div className="d-flex align-items-end">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setLocationFilter("Any");
                    setMinRating(0);
                    setPriceSort("none");
                  }}
                  type="button"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* 🏨 Listings */}
          <div className="row justify-content-center">
            {visibleListings.length > 0 ? (
              visibleListings.map((detail) => (
                <div className="col-md-3 mb-4" key={detail._id}>
                  <div
                    className="card shadow-sm"
                    style={{
                      width: "18rem",
                      border: "none",
                      borderRadius: "15px",
                      overflow: "hidden",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.03)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 20px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 10px rgba(0,0,0,0.1)";
                    }}
                  >
                    <img
                      src={detail.image}
                      alt={detail.name || "listing image"}
                      className="card-img-top"
                      style={{
                        height: "250px",
                        objectFit: "cover",
                        borderBottom: "2px solid #f0f0f0",
                      }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{detail.name}</h5>

                      <div style={{ marginBottom: 8 }}>
                        <StarDisplay
                          value={detail.averageRating || 0}
                          size={14}
                          showNumber={true}
                        />
                        <small className="text-muted d-block">
                          {detail.reviews?.length
                            ? `(${detail.reviews.length} review${
                                detail.reviews.length > 1 ? "s" : ""
                              })`
                            : "No reviews yet"}
                        </small>
                      </div>

                      <p className="card-text text-muted mb-2">
                        ₹{detail.price} one night
                      </p>
                      <Link
                        to={`/details/${detail._id}`}
                        className="btn w-100"
                        style={{
                          backgroundColor: "#E30B5C",
                          color: "white",
                          borderRadius: "20px",
                          fontWeight: "600",
                        }}
                      >
                        More Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted">
                No listings match your filters.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default GuestDashboard;
