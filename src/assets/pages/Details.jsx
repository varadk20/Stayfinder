// src/pages/Details.jsx
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Map from "../components/Map";
import Datepicker from "../components/Datepicker";
import { io } from "socket.io-client";

function StarRating({ value, onChange, editable = true }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "inline-block", fontSize: 22 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            cursor: editable ? "pointer" : "default",
            marginRight: 6,
            color: (hover || value) >= i ? "#FFD700" : "#DDD",
            transition: "color 0.1s",
          }}
          onMouseEnter={() => editable && setHover(i)}
          onMouseLeave={() => editable && setHover(0)}
          onClick={() => editable && onChange(i)}
        >
          {(hover || value) >= i ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setListing] = useState(null);
  const [bookingInfo, setBookingInfo] = useState({ nights: 0, total: 0, checkIn: null, checkOut: null });
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingRating, setEditingRating] = useState(5);
  const [editingComment, setEditingComment] = useState("");
  const socketRef = useRef(null);

  const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const currentUserEmail = localStorage.getItem("userEmail") || "guest@example.com";

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${BACKEND}/getReviews/${id}`);
      if (res.data) {
        setReviews(res.data.reviews || []);
        setAverageRating(res.data.averageRating || 0);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const baseUrl = BACKEND.replace(/\/$/, "");
    let socket;
    try {
      socket = io(baseUrl, { transports: ["websocket", "polling"] });
      socketRef.current = socket;
      socket.on("connect", () => {
        console.log("socket connected", socket.id);
        socket.emit("joinListingRoom", id);
      });
      socket.on("reviewAdded", (payload) => {
        if (payload?.listingId === id) fetchReviews();
      });
      socket.on("reviewUpdated", (payload) => {
        if (payload?.listingId === id) fetchReviews();
      });
      socket.on("reviewDeleted", (payload) => {
        if (payload?.listingId === id) fetchReviews();
      });
      socket.on("connect_error", (err) => console.warn("Socket connect_error:", err?.message || err));
    } catch (err) {
      console.warn("Socket init error:", err);
    }
    return () => {
      try {
        if (socket) {
          socket.emit("leaveListingRoom", id);
          socket.removeAllListeners();
          socket.disconnect();
        }
        socketRef.current = null;
      } catch (err) {
        console.warn("Socket cleanup error:", err);
      }
    };
  }, [id, BACKEND]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${BACKEND}/getListingById/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error("Failed to fetch listing:", err);
      }
    };
    fetchListing();
    fetchReviews();
  }, [id]);

  const handleBooking = async () => {
    if (bookingInfo.total === 0) {
      alert("Please select valid check-in and check-out dates.");
      return;
    }
    if (!window.confirm("Do you want to confirm this booking?")) return;

    try {
      const guestEmail = currentUserEmail;
      const response = await axios.post(`${BACKEND}/book`, {
        listingId: id,
        listingName: details?.name,
        guestEmail,
        checkIn: bookingInfo.checkIn,
        checkOut: bookingInfo.checkOut,
        nights: bookingInfo.nights,
        totalPrice: bookingInfo.total,
      });
      alert("Booking confirmed!");
      console.log("Booking saved:", response.data);
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Something went wrong while saving the booking.");
    }
  };

  const submitReview = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!ratingInput || ratingInput < 1 || ratingInput > 5) {
      alert("Please select a rating between 1 and 5.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        listingId: id,
        userEmail: currentUserEmail,
        rating: Number(ratingInput),
        comment: commentInput || "",
      };
      await axios.post(`${BACKEND}/addReview`, payload);
      await fetchReviews();
      setCommentInput("");
      setRatingInput(5);
    } catch (err) {
      console.error("Submit review error:", err);
      alert(err?.response?.data?.message || "Could not submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (r) => {
    setEditingReviewId(r._id || r.id);
    setEditingRating(r.rating);
    setEditingComment(r.comment || "");
  };
  const cancelEdit = () => {
    setEditingReviewId(null);
    setEditingRating(5);
    setEditingComment("");
  };
  const submitEdit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!editingReviewId) return;
    try {
      const payload = { userEmail: currentUserEmail, rating: editingRating, comment: editingComment };
      await axios.put(`${BACKEND}/editReview/${id}/${editingReviewId}`, payload);
      await fetchReviews();
      cancelEdit();
    } catch (err) {
      console.error("Edit review error:", err);
      alert(err?.response?.data?.message || "Could not edit review.");
    }
  };
  const deleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await axios.delete(`${BACKEND}/deleteReview/${id}/${reviewId}`, { data: { userEmail: currentUserEmail } });
      await fetchReviews();
    } catch (err) {
      console.error("Delete review error:", err);
      alert(err?.response?.data?.message || "Could not delete review.");
    }
  };

  if (!details) return <div className="text-center mt-5">Loading...</div>;

  return (
    <>
      <Navbar role="guest" />
      <div
        style={{
          background: "linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)",
          minHeight: "100vh",
          paddingBottom: "40px",
        }}
      >
        <div className="container mt-5">
          <h5 className="text-muted">Property: {details.location}</h5>

          {/* ---------- Mixed card layout (image on top, info below) ---------- */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
            <div
              className="card shadow"
              style={{
                width: "100%",
                maxWidth: 760,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <img
                src={details.image}
                className="card-img-top"
                alt={details.name}
                style={{ height: 300, objectFit: "cover", width: "100%" }}
              />
              <div className="card-body">
                <h3 style={{ marginBottom: 6 }}>{details.name}</h3>
                <p className="mb-1" style={{ fontSize: 18 }}>
                  <strong>₹{details.price}</strong> per night
                </p>

                <p style={{ marginTop: 10, marginBottom: 0 }}>
                  <strong>Average Rating:</strong>{" "}
                  {averageRating ? averageRating.toFixed(1) : "No ratings yet"}{" "}
                  {averageRating ? `(${reviews.length} review${reviews.length !== 1 ? "s" : ""})` : ""}
                </p>
              </div>
            </div>
          </div>

          {/* ---------- Description below the card ---------- */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <div style={{ maxWidth: 760, width: "100%" }}>
              <h4 className="mt-4">Description</h4>
              <ul className="list-unstyled">
                {details.description
                  .split(".")
                  .filter((s) => s.trim().length > 0)
                  .map((sentence, index) => (
                    <li key={index} style={{ fontSize: "18px", marginBottom: "8px", lineHeight: "1.6" }}>
                      • {sentence.trim()}.
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Map and Booking Section (kept, but aligned under main card) */}
        <div className="container my-5">
          <h4 className="mt-5 mb-4">Location</h4>
          <div className="d-flex flex-wrap gap-4">
            <div style={{ border: "1px solid #E30B5C", height: "400px", flex: 1, minWidth: 300 }}>
              <Map />
            </div>

            <div style={{ minWidth: 300, maxWidth: 420 }}>
              <Datepicker price={details.price} onTotalChange={setBookingInfo} />

              <p
                className="mt-3"
                style={{
                  fontSize: "16px",
                  color: "#555",
                  overflowWrap: "break-word",
                  maxWidth: "420px",
                }}
              >
                📍 <strong>Address:</strong>
                <br /> {details.address}
              </p>

              <button
                type="button"
                className="btn btn-lg btn-block mt-3"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details.address)}`,
                    "_blank"
                  )
                }
                style={{ width: "100%", backgroundColor: "#E30B5C", color: "white" }}
              >
                Directions
              </button>

              <button
                type="button"
                className="btn btn-lg btn-block mt-3"
                style={{ width: "100%", backgroundColor: "#E30B5C", color: "white" }}
                onClick={handleBooking}
              >
                Book Now{" "}
                {bookingInfo.nights > 0 &&
                  `(₹${bookingInfo.total} for ${bookingInfo.nights} night${
                    bookingInfo.nights > 1 ? "s" : ""
                  })`}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section (unchanged) */}
        <div className="container my-5">
          <h3>Reviews</h3>

          <form onSubmit={(e) => e.preventDefault()} style={{ maxWidth: 700 }} className="mb-4">
            <div className="mb-2">
              <label>
                <strong>Your rating:</strong>
              </label>
              <div>
                <StarRating value={ratingInput} onChange={setRatingInput} editable={true} />
              </div>
            </div>

            <div className="mb-2">
              <label>
                <strong>Comment:</strong>
              </label>
              <textarea
                className="form-control"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                rows={3}
                placeholder="Share your experience..."
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              disabled={submitting}
              onClick={submitReview}
            >
              {submitting ? "Submitting..." : "Submit review"}
            </button>
          </form>

          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to review!</p>
          ) : (
            <div style={{ maxWidth: 800 }}>
              {reviews.map((r, idx) => {
                const reviewId = r._id || r.id || idx;
                const isOwn = r.userEmail === currentUserEmail;
                return (
                  <div key={reviewId} className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                          <strong>{r.userEmail}</strong>
                          <div style={{ fontSize: 14, color: "#777" }}>
                            {r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}
                          </div>
                        </div>
                        <div style={{ fontSize: 18 }}>
                          <StarRating value={r.rating} editable={false} onChange={() => {}} />
                        </div>
                      </div>

                      {editingReviewId === reviewId ? (
                        <form onSubmit={submitEdit} className="mt-3">
                          <StarRating value={editingRating} onChange={setEditingRating} editable />
                          <textarea
                            className="form-control mt-2"
                            rows={3}
                            value={editingComment}
                            onChange={(e) => setEditingComment(e.target.value)}
                          />
                          <div className="mt-2">
                            <button className="btn btn-sm btn-success me-2" type="submit">
                              Save
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              type="button"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <p style={{ marginTop: 8 }}>{r.comment}</p>
                          {isOwn && (
                            <div style={{ display: "flex", gap: 8 }}>
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => startEdit(r)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => deleteReview(reviewId)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
