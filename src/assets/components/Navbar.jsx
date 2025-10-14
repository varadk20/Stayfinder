// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar({ role }) {
  // Links for Host
  const hostLinks = [
    { path: "/mylistings", label: "My-Listings" },
    { path: "/host", label: "List-Property" },
    { path: "/analytics", label: "Analytics" },
  ];

  // Links for Guest
  const guestLinks = [
    { path: "/guestDashboard", label: "Browse" }, // or /browse
    { path: "/contact", label: "Contact" },
  ];

  const links = role === "host" ? hostLinks : guestLinks;

  return (
    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
      <img src={logo} alt="logo" style={{ height: "60px" }} />

      <div className="d-flex align-items-center">
        <nav className="my-2 my-md-0 d-flex align-items-center">
          {links.map((link, index) => (
            <Link
              key={index}
              className="p-2 text-dark text-decoration-none me-4"
              to={link.path}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <a className="btn btn-outline-danger" href="/">
          Logout
        </a>
      </div>
    </div>
  );
}

export default Navbar;
