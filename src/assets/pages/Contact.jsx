// src/assets/pages/Contact.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

function Contact() {
  const [form, setForm] = useState({
    from: "",
    to: "admin@gmail.com",
    subject: "",
    description: "",
  });

  // ✅ Fetch logged-in user's email when component loads
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
      console.log("Server response:", data);

      if (response.ok) {
        alert("✅ Query submitted successfully!");
        setForm({
          from: form.from, // keep same email
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
      {/* Guest Navbar */}
      <Navbar role="guest" />

      <div className="container mt-5">
        <div className="card shadow p-4">
          <h2 className="text-center mb-4">Contact the Admin</h2>

          <p className="fs-5 text-muted text-center">
            If you have any queries regarding listings or bookings, feel free to reach out.
          </p>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
              <label className="form-label">From (Your Email)</label>
              <input
                type="email"
                name="from"
                value={form.from}
                className="form-control"
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label">To (Admin Email)</label>
              <input
                type="email"
                name="to"
                value={form.to}
                className="form-control"
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Subject</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter subject"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="form-control"
                rows="4"
                placeholder="Write your message here..."
                required
              ></textarea>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary px-4">
                Submit Query
              </button>
            </div>
          </form>

          {/* Admin Info */}
          <div className="mt-5 border-top pt-4">
            <h4>About the Admin</h4>
            <p>
              Our admin team is here to assist you with your listings or booking-related queries.
              Please expect a reply within 24 hours.
            </p>

            <h5>Email</h5>
            <p>
              📧 <a href="mailto:admin@gmail.com">admin@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;




// src/pages/Contact.jsx
// import React from "react";
// import Navbar from "../components/Navbar";

// function Contact() {
//   return (
//     <>
//       {/* Guest Navbar */}
//       <Navbar role="guest" />

//       <div className="container mt-5">
//         <div className="card shadow p-4">
//           <h2 className="text-center mb-4">Contact the Host</h2>
          
//           <p className="fs-5 text-muted text-center">
//             If you have any queries regarding listings or bookings, feel free to reach out to the host.
//           </p>

//           <div className="mt-4">
//             <h4>Host Description</h4>
//             <p>
//               Hello! I am <strong>Sanika</strong>, a dedicated host passionate about 
//               providing comfortable and affordable stays for guests. 
//               I ensure all properties are well-maintained and 
//               guest-friendly.
//             </p>

//             <h4>Email</h4>
//             <p>
//               📧 <a href="mailto:host@example.com">sanika@gmail.com</a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Contact;
