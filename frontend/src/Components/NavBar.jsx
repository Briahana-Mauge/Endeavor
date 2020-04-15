/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
NavBar Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = ({ loggedUser, logout }) => {
  const isAdmin = !!(loggedUser && loggedUser.a_id);

  let showATools = null;
  if (isAdmin === true) {
    showATools = <NavLink className="dropdown-item" to='/tools'>Admin Tools</NavLink>
  }


  return (
    <div className="to-be-navbarcomponent">
      <ul className="navbar-nav">
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
  );
}

export default NavBar;
