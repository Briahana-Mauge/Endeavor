/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
NavBar Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';
import { NavLink, Link } from 'react-router-dom';


/* BOOTSTRAP NAVBAR CLASSES */
const liPadding = "p-3";
const bgThemeChoices = ["", "bg-dark", "bg-light"]
const bgTheme = bgThemeChoices[1];



/* MAIN */
const NavBar = ({ loggedUser, logout }) => {
  const isAdmin = !!(loggedUser && loggedUser.a_id);

  let showAdminDropdown = null;
  if (isAdmin === true) {
    showAdminDropdown = (
      <NavDropdown topText="Admin">
        <NavLink className="dropdown-item" to='/tools/users'>Edit App Users</NavLink>
        <NavLink className="dropdown-item" to='/tools/cohorts'>Edit Cohorts</NavLink>
        <NavLink className="dropdown-item" to='/tools/skills'>Edit Volunteer Skills</NavLink>
      </NavDropdown>
    );
  }


  return (
    <nav className={`g1Navbar navbar navbar-expand-md navbar-dark container-fluid`}>
      <Logo />
      <Burger />
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="container-md navbar-nav">

          <NavOneLink to="/home" text="Home" />

          <NavDropdown topText="Volunteers">
            <NavLink className="dropdown-item" to='/volunteers/search'>Volunteers Search</NavLink>
            <Divider />
          </NavDropdown>

          <NavDropdown topText="Events">
            <NavLink className="dropdown-item" to='/events/search'>Events Search</NavLink>
            <Divider />
          </NavDropdown>

          <NavDropdown topText="Fellows">
            <NavLink className="dropdown-item" to='/volunteers/search'>Volunteers Search</NavLink>
            <Divider />
          </NavDropdown>

          {showAdminDropdown}

          <NavOneLink to='/profile' text="My Profile" liClassName="ml-auto" />

          <Logout logout={logout} />

        </ul>
      </div>
    </nav>
  );
}


/* HELPER COMPONENTS */
const Logo = () => {
  return(
    <Link className="g1Brand navbar-brand" to="/home">
      Endea<span>V</span>or
    </Link>
  );
}

const Burger = () => {
  return(
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>
  );
}

const NavOneLink = ({ to, text, liClassName }) => {
  return(
    <li className={`nav-item ${liClassName}`}>
      <NavLink className={`nav-link ${liPadding}`} to={to}>{text}</NavLink>
    </li>
  );
}

const NavDropdown = (props) => {
  const { topText, children } = props;

  return (
    <li className="nav-item dropdown">
      <NavLink
        to="/home" // does not affect execution because preventDefault but pointing at /home just in case
        onClick={(e) => e.preventDefault()}
        className={`nav-link dropdown-toggle ${liPadding}`}
        data-toggle="dropdown"
        role="button"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {topText}
      </NavLink>
      <div className={`dropdown-menu ${bgTheme}`}>
        {children}
      </div>
    </li>
  );
}

const Divider = () => <div className="dropdown-divider"></div>

const Logout = ({logout}) => {
  return(
    <li className="nav-item">
      <button
        className="nav-link g1BtnAsLink"
        onClick={logout}
      >
        Logout
      </button>
    </li>
  );
}


export default NavBar;
