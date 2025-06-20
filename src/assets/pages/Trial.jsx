import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function Trial() {
  const [details, setDetails] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/getListings')
      .then(details => setDetails(details.data))
      .catch(err => console.error(err));
  }, []);

  return (

    <div>
      <h2>hello</h2>
      <div className="container mt-3">
        <div className="row">
          {
            details.map((detail, index) => {

              return (
                <div className="col-md-3 mb-4" key={index}>
                  <div className="card" style={{ width: '18rem' }}>
                    <img src={`data:image/jpeg;base64,${detail.image}`} alt="img" className="card-img-top" 
                    style={{height:'250px'}}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{detail.location}</h5>
                      <p className="card-text">₹{detail.price}</p>
                      <a href="#" className="btn btn-primary">More Details</a>
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    </div>

  );
}

export default Trial;
