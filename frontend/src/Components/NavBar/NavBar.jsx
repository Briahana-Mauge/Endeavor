/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
NavBar Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';
import { NavLink, Link } from 'react-router-dom';


/* BOOTSTRAP NAVBAR CLASSES */
const liPadding = "px-3";


/* MAIN */
const NavBar = ({ loggedUser, logout }) => {
  // IS VARIABLE: determine user type and assign variable
  // not passed down as prop from App because will use loggedUser to fetch userdata for avatar and name dnavModeplay on navbar
  const navMode = {};
  if (loggedUser && loggedUser.admin) {
    navMode["admin"] = true;
  } else if (loggedUser && loggedUser.a_id) {
    navMode["staff"] = true;
  } else if (loggedUser && loggedUser.v_id) {
    navMode["volunteer"] = true;
  } else {
    navMode["fellow"] = true;
  }


/* ACCESS STRATEGY (Admins, Staff, Volunteers, Fellows)

VOLUNTEERS PAGE/DASHBOARD: Admins, Staff
=> possible alternate YOUR MENTOR(S) PAGE: Fellows

EVENTS PAGE/DASHBOARD: All

FELLOWS PAGE/DASHBOARD: Admins, Staff
=> possible alternate YOUR MENTEE(S) PAGE: Volunteers

ADMIN TOOLS (edit app users, edit cohorts, edit volunteer skills): Admins
*/


  /* BUILD LIMITED ACCESS NAVS */
  const
    volunteersLink = <NAV_LINK to="/volunteers/home" text="Volunteers" />,
    // fellowsLink = <NAV_LINK to='/fellows/home' text="Fellows" />,
    adminDropdown = (
      <NavDropdown topText="Admin">
        <NAV_DD_LINK to='/tools/users' text="Edit App Users" />
        <NAV_DD_LINK to='/tools/cohorts' text="Edit Cohorts" />
        <NAV_DD_LINK to='/tools/skills' text="Edit Volunteer Skills" />
      </NavDropdown>
    )
  ;


  /* TOGGLE LIMITED ACCESS NAV DISPLAYS */
  let
    showVolunteersLink = null,
    // showFellowsLink = null,
    showAdminDropdown = null
  ;
  if (navMode.admin || navMode.staff) {
    showVolunteersLink = volunteersLink;
    // showFellowsLink = fellowsLink;
  }
  if (navMode.admin) {
    showAdminDropdown = adminDropdown;
  }


  return (
    <nav className={`g1Navbar navbar fixed-top navbar-expand-lg navbar-dark py-0 container-fluid`}>
      <Logo />
      <Burger />
      <div className="collapse navbar-collapse bg-dark" id="navbarSupportedContent">
        <ul className="container-lg navbar-nav align-items-end">

          <NAV_LINK to="/home" text="Home" />

          {showVolunteersLink}

          <NAV_LINK to='/events/home' text="Events" />

          {/* {showFellowsLink} */}

          {showAdminDropdown}

          <NAV_LINK to='/profile' text="My Profile" liClassName="ml-auto" />

          <Logout logout={logout} />

        </ul>
      </div>
    </nav>
  );
}


/* NAV COMPONENTS */
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

// const Divider = () => <div className="dropdown-divider"></div>

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
