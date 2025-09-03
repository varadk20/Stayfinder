import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Map from "../components/Map";
import Date from "../components/Datepicker";

function Details() {
  const { id } = useParams();
  const [details, setListing] = useState(null);
  const [bookingInfo, setBookingInfo] = useState({ nights: 0, total: 0 });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/getListingById/${id}`)
      .then((res) => {
        setListing(res.data);
      })
      .catch((err) => console.error(err));
  }, [id]);


  const handleBooking = async () => {
    if (bookingInfo.total === 0) {
      alert("Please select valid check-in and check-out dates.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/create-checkout-session`, {
        amount: bookingInfo.total * 100, // amount in paisa
        name: details.name,
      });

      window.location.href = response.data.url; // redirect to Stripe payment
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong with the payment.");
    }
  };
  

  if (!details) return <div className="text-center mt-5">Loading...</div>;

  return (
    <>
      <Navbar role="host" />
      <div className="container mt-5">
        <h5 className="text-muted">Property: {details.location}</h5>

        <div className="d-flex gap-5">
          <div className="card" style={{ height: "400px", flex: 1 }}>
            <img
              src={details.image}
              className="card-img-top"
              alt="listing"
              style={{ height: "280px" }}
            />
            <div className="card-body">
              <h4 className="card-title">{details.name}</h4>
              <p className="card-text fs-5">₹{details.price} per night</p>
            </div>
          </div>

          <div
            className="flex-grow-1"
            style={{ marginLeft: "150px", maxWidth: "500px" }}
          >
            <h3>Description:</h3>
            <ul className="list-unstyled">
              {details.description
                .split(".")
                .filter((sentence) => sentence.trim().length > 0)
                .map((sentence, index) => (
                  <li
                    style={{
                      fontSize: "25px",
                      marginBottom: "10px",
                      lineHeight: "2",
                    }}
                    key={index}
                  >
                    • {sentence.trim()}.
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Map and Booking Section */}
      <div className="container my-5">
        <h4 className="mt-5 mb-4">Location</h4>
        <div className="d-flex gap-5">
          <div style={{ border: "1px solid red", height: "400px", flex: 1 }}>
            <Map />
          </div>
          <div>
            <Date price={details.price} onTotalChange={setBookingInfo} />

            <p
              className="mt-3"
              style={{
                fontSize: "18px",
                color: "#555",
                overflowWrap: "break-word",
                maxWidth: "500px",
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
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    details.address
                  )}`,
                  "_blank"
                )
              }
              style={{
                width: "100%",
                backgroundColor: "#E30B5C",
                color: "white",
              }}
            >
              Directions
            </button>

            <button
              type="button"
              className="btn btn-lg btn-block mt-3"
              style={{
                width: "100%",
                backgroundColor: "#E30B5C",
                color: "white",
              }}
              onClick={handleBooking}
            >
              Book Now {bookingInfo.nights > 0 && `(₹${bookingInfo.total} for ${bookingInfo.nights} night${bookingInfo.nights > 1 ? "s" : ""})`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Details;
