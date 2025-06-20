// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar() {
  return (
    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
      <img
        src={logo}
        alt="logo"
        className="my-0"
        style={{ height: "60px" }}
      />
      <div className="d-flex align-items-center">
        <nav className="my-2 my-md-0 d-flex align-items-center">
          <Link className="p-2 text-dark text-decoration-none me-4" to='/home'>
            Home
          </Link>
          <Link className="p-2 text-dark text-decoration-none me-4" to="/mylistings">
            My-Listings
          </Link>
          <Link className="p-2 text-dark text-decoration-none me-4" to="/host">
            List-Property
          </Link>

          {/* Search Box */}
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search listings"
              aria-label="Search"
              style={{ width: "200px" }}
            />
            <button className="btn me-5" type="submit" style={{backgroundColor:'#E30B5C', color:'white'}}>
              Search
            </button>
          </form>
        </nav>
        <a className="btn btn-outline-primary" href="/">
          Logout
        </a>
      </div>
    </div>
  );
}

export default Navbar;
