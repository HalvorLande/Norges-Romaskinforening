import React from 'react';
import { Link } from 'react-router-dom'; // For navigation

import './Header.css'; // Import the CSS file for styling

const Header = () => {
  return (
    <header className="header-container">
      <div className="header-logo">
        <h1>Norges Romaskinforening</h1>
      </div>
      <nav className="header-nav">
        <ul className="header-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/Forside">Forside</Link></li>
          <li><Link to="/Min profil">Min profil</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
