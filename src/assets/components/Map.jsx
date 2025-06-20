import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useParams } from 'react-router-dom';
import axios from 'axios';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';

function Map() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [coords, setCoords] = useState(null);
  const OPENWEATHER_API_KEY = import.meta.env.VITE_GEO_API;


  useEffect(() => {
    axios
      .get(`http://localhost:3000/getListingById/${id}`)
      .then((res) => {
        setDetails(res.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    if (details?.location) {
      const encodedLocation = encodeURIComponent(details.location);
      axios
        .get(
          `http://api.openweathermap.org/geo/1.0/direct?q=${encodedLocation}&limit=1&appid=${OPENWEATHER_API_KEY}`
        )
        .then((res) => {
          if (res.data && res.data.length > 0) {
            const { lat, lon } = res.data[0];
            setCoords({ lat, lon });
          } else {
            console.warn('No geocoding results for:', details.location);
          }
        })
        .catch((err) => console.error('OpenWeather geocode error:', err));
    }
  }, [details]);

  if (!details) return <div className="text-center mt-5">Loading...</div>;
  if (!coords) return <div className="text-center mt-5">Loading map...</div>;

  return (
    <MapContainer
      center={[coords.lat, coords.lon]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={[coords.lat, coords.lon]} />
    </MapContainer>
  );
}

export default Map;
