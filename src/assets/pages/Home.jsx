import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from '../components/Navbar'

function Home() {
  const [details, setDetails] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000/getListings")
      .then((details) => {
        setDetails(details.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Navbar/>

      <div className="container mt-5">
        <div className="row">
          {details.map((detail, index) => {
            return (
              <div className="col-md-3 mb-4" key={index}>
                <div className="card" style={{ width: "18rem" }}>
                  <img
                    src={`data:image/jpeg;base64,${detail.image}`}
                    alt="img"
                    className="card-img-top"
                    style={{ height: "250px" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{detail.location}</h5>
                    <p className="card-text">₹{detail.price}</p>
                    <Link
                      to={`/details/${detail._id}`}
                      className="btn btn-primary"
                    >
                      More Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Home;
