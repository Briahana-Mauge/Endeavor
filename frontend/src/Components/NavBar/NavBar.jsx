/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
NavBar Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';
import { NavLink } from 'react-router-dom';

import ALink from './ALink';


const NavBar = ({ loggedUser, logout }) => {
  const isAdmin = !!(loggedUser && loggedUser.a_id);

  let showATools = null;
  if (isAdmin === true) {
    showATools = <NavLink className="dropdown-item" to='/tools'>Admin Tools</NavLink>
  }


  return (
    <nav className="navbar g1Navbar navbar-expand-md container-fluid">
      <a className="navbar-brand g1Brand" href="#">P<span>URSUIT</span> &#123;<span>VM</span>&#125;</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink className="nav-link" to='/home'>Dashboard</NavLink>
          </li>
          <li className="nav-item">
            <button className="nav-link g1FakeALink g1DisableLink">Button</button>
          </li>
          <ALink disabled={false} dim={false} href="http://www.google.com" className="nav-link">A-Link!</ALink>
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="/" role="button" aria-haspopup="true" aria-expanded="false">Working Pages</a>
            <div className="dropdown-menu">
              <NavLink className="dropdown-item" to='/profile'>My Profile</NavLink>
              {showATools}
              <NavLink className="dropdown-item" to='/volunteers/search'>Volunteers Search</NavLink>
              <NavLink className="dropdown-item" to='/events/search'>Events Search</NavLink>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href="/" onClick={logout}>Logout</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
