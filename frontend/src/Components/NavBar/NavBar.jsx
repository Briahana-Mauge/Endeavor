/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
NavBar Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';
import { NavLink, Link, useHistory } from 'react-router-dom';


/* BOOTSTRAP NAVBAR CLASSES */
const liPadding = "px-3";


/* MAIN */
const NavBar = ({ loggedUser, logout }) => {
  const history = useHistory();

  const is = {};
  if (loggedUser) {
    if (loggedUser.admin) {
      is["admin"] = true;
    } else if (loggedUser.a_id) {
      is["staff"] = true;
    } else if (loggedUser.v_id) {
      is["volunteer"] = true;
    } else {
      is["fellow"] = true;
    }
  } else {
    history.push('/');
  }


  const adminDropdown = (
    <NavDropdown topText="Admin">
      <NAV_DD_LINK to='/tools/users' text="Edit App Users" />
      <NAV_DD_LINK to='/tools/cohorts' text="Edit Cohorts" />
      <NAV_DD_LINK to='/tools/skills' text="Edit Volunteer Skills" />
    </NavDropdown>
  );


  return (
    // <nav className={`g1Navbar navbar navbar-expand-lg navbar-dark container-fluid`}>
    <nav className={`g1Navbar navbar fixed-top navbar-expand-lg navbar-dark py-0 container-fluid`}>
      <Logo />
      <Burger />
      <div className="collapse navbar-collapse bg-dark" id="navbarSupportedContent">
        <ul className="container-lg navbar-nav align-items-end">

          <NAV_LINK to="/home" text="Home" />

          <NavDropdown topText="Volunteers">
            <NAV_DD_LINK to='/volunteers/search' text="Volunteers Search" />
          </NavDropdown>

          <NavDropdown topText="Events">
            <NAV_DD_LINK to='/events/search' text="Events Search" />
          </NavDropdown>

          <NavDropdown topText="Fellows">
            <NAV_DD_LINK to='/fellows/search' text="Fellows Search" />
          </NavDropdown>

          {is.admin ? adminDropdown : null}

          <NAV_LINK to='/profile' text="My Profile" liClassName="ml-auto" />

          <Logout logout={logout} />

        </ul>
      </div>
    </nav>
  );
}


/* HELPER COMPONENTS */
const Logo = () => {
  return(
    <Link className="g1Brand navbar-brand py-0 mr-5" to="/home">
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

const NAV_LINK = ({ to, text, liClassName }) => {
  return(
    <li className={`nav-item ${liClassName}`}>
      <NavLink className={`nav-link ${liPadding}`} to={to}>{text}</NavLink>
    </li>
  );
}

const NAV_DD_LINK = ({ to, text }) => {
  return(
    <NavLink className="dropdown-item px-3" to={to}>{text}</NavLink>
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
      <div className={`dropdown-menu bg-dark`}>
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
        className={`nav-link g1BtnAsLink ${liPadding} pr-lg-0`}
        onClick={logout}
      >
        Logout
      </button>
    </li>
  );
}


export default NavBar;
