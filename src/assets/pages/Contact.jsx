// src/assets/pages/Contact.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import image1 from "../images/image1.png"; // ✅ your image

function Contact() {
  const [form, setForm] = useState({
    from: "",
    to: "admin@gmail.com",
    subject: "",
    description: "",
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setForm((prev) => ({ ...prev, from: savedEmail }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Query submitted successfully!");
        setForm({
          from: form.from,
          to: "admin@gmail.com",
          subject: "",
          description: "",
        });
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (error) {
      console.error("Error submitting query:", error);
      alert("⚠️ Network error. Please try again later.");
    }
  };

  return (
    <>
      <Navbar role="guest" />

      {/* 🌈 Center background */}
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
        {/* 🪟 Contact card with background image */}
        <div
          className="card shadow-lg p-4"
          style={{
            maxWidth: "700px",
            width: "100%",
            borderRadius: "15px",
            backgroundImage: `url(${image1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* translucent overlay for readability */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 0,
              borderRadius: "15px",
            }}
          ></div>

          {/* actual content */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 className="text-center mb-3 fw-bold" style={{ color: "#fff" }}>
              Contact the Admin
            </h2>

            <p className="fs-5 text-center" style={{ color: "#f1f1f1" }}>
              If you have any queries regarding listings or bookings, feel free
              to reach out.
            </p>

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-3">
                <label className="form-label fw-semibold text-light">
                  From (Your Email)
                </label>
                <input
                  type="email"
                  name="from"
                  value={form.from}
                  className="form-control"
                  readOnly
                  style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-light">
                  To (Admin Email)
                </label>
                <input
                  type="email"
                  name="to"
                  value={form.to}
                  className="form-control"
                  readOnly
                  style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-light">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter subject"
                  required
                  style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-light">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="form-control"
                  rows="4"
                  placeholder="Write your message here..."
                  required
                  style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                ></textarea>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-light px-5 py-2"
                  style={{
                    borderRadius: "25px",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  Submit Query
                </button>
              </div>
            </form>

            <div className="mt-5 border-top pt-4 text-light">
              <h4 className="fw-semibold">About the Admin</h4>
              <p>
                Our admin team is here to assist you with your listings or
                booking-related queries. Please expect a reply within 24 hours.
              </p>

              <h5>Email</h5>
              <p>
                📧{" "}
                <a
                  href="mailto:admin@gmail.com"
                  style={{ color: "#fff", textDecoration: "underline" }}
                >
                  admin@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
