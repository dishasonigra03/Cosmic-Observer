import React from 'react';
// Import NavLink from react-router-dom
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* We are now using NavLink instead of <a> */}
      {/* The 'target="_blank"' attribute has been removed. */}

      <NavLink to="/" className="nav-link">Home</NavLink>
      <NavLink to="/iss-tracker" className="nav-link">ISS Tracker</NavLink>
      <NavLink to="/mars-weather" className="nav-link">Mars Weather</NavLink>
      <NavLink to="/neo-watch" className="nav-link">NEO Watch</NavLink>
      <NavLink to="/telemetry" className="nav-link">Live Telemetry</NavLink>
    </nav>
  );
};

export default Navbar;