// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";

// function Contact() {
//   const [contact, setContact] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetch("/api/contact")
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch contact details");
//         return res.json();
//       })
//       .then((data) => {
//         setContact(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <>
//       <Navbar />
//       <div className="container mt-5 text-center">
//         <h2>Contact Us</h2>
//         {loading && <p>Loading...</p>}
//         {error && <p className="text-danger">{error}</p>}
//         {contact && (
//           <div>
//             <p className="text-muted">{contact.description}</p>
//             <p>
//               <strong>Email:</strong> {contact.email}
//             </p>
//             <p>
//               <strong>Phone:</strong> {contact.phone}
//             </p>
//             <p>
//               <strong>Address:</strong> {contact.address}
//             </p>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// export default Contact;



// src/pages/Contact.jsx
import React from "react";
import Navbar from "../components/Navbar";

function Contact() {
  return (
    <>
      {/* Guest Navbar */}
      <Navbar role="guest" />

      <div className="container mt-5">
        <div className="card shadow p-4">
          <h2 className="text-center mb-4">Contact the Host</h2>
          
          <p className="fs-5 text-muted text-center">
            If you have any queries regarding listings or bookings, feel free to reach out to the host.
          </p>

          <div className="mt-4">
            <h4>Host Description</h4>
            <p>
              Hello! I am <strong>Sanika</strong>, a dedicated host passionate about 
              providing comfortable and affordable stays for guests. 
              I ensure all properties are well-maintained and 
              guest-friendly.
            </p>

            <h4>Email</h4>
            <p>
              📧 <a href="mailto:host@example.com">sanika@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
