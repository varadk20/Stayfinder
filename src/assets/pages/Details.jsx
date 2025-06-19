import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Map from "../components/Map";
import Date from "../components/Datepicker";

function Details() {
  const { id } = useParams();
  const [details, setListing] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/getListingById/${id}`)
      .then((res) => {
        setListing(res.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!details) return <div className="text-center mt-5">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h5 className="text-muted">Property: {details.location}</h5>
        <div className="card" style={{ maxWidth: "500px" }}>
          <img
            src={`data:image/jpeg;base64,${details.image}`}
            className="card-img-top"
            alt="listing"
            style={{ height: "250px" }}
          />
          <div className="card-body">
            <h4 className="card-title">{details.name}</h4>
            {/* Display proper name */}

            <p className="card-text fs-5">₹{details.price}</p>
          </div>
        </div>
      </div>

      {/* Map */}

      <div className="container my-5">
        <h4 className="mt-5 mb-5">Location</h4>
        <div className="d-flex gap-5">
          <div style={{ border: "1px solid red", height: "400px", flex: 1 }}>
            <Map />
          </div>
          <div>
            <Date />
          </div>
        </div>
      </div>
    </>
  );
}

export default Details;
