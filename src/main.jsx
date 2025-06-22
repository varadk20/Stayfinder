import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './assets/pages/Login.jsx';
import Signup from './assets/pages/Signup.jsx';
import Home from './assets/pages/Home.jsx';
import Details from './assets/pages/Details.jsx'
import Map from './assets/components/Map.jsx'
import Date from './assets/components/Datepicker.jsx'
import Host from './assets/pages/Host.jsx'
import MyListings from './assets/pages/MyListings.jsx'
import EditListing from './assets/pages/EditListing';
import Status from './assets/components/Status.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/date" element={<Date/>} />
        <Route path="/host" element={<Host/>} />
        <Route path="/mylistings" element={<MyListings/>} />
        <Route path="/edit-listing/:id" element={<EditListing />} />
        <Route path="/status" element={<Status />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>
);
