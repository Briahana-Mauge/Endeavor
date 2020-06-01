/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
NavBar Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, Link } from 'react-router-dom';


/* BOOTSTRAP NAVBAR CLASSES */
const liPadding = "px-3";
const logoutLiPadding = "pl-3";


/* MAIN */
const NavBar = ({ h1, loggedUser, logout }) => {
  // SCREEN WIDTH RESPONSE SYSTEM: needed to make navbar dropdown on mobile devices disappear on click
  const isClient = typeof window === 'object';
  const checkWidth = useCallback(() => {
    const screenWidth = isClient ? window.innerWidth : undefined;
    return screenWidth <= 992;
  }, [isClient]);

  const [isBurgerOn, setIsBurgerOn] = useState(checkWidth);

  useEffect(() => {
    if (!isClient) {
      return false;
    }
    function handleResize() {
      setIsBurgerOn(checkWidth());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isClient, checkWidth]);
  // END SCREEN WIDTH RESPONSE SYSTEM


  // USERMODE VARIABLE: determine user type and assign variable
  // not passed down as prop from App because will use loggedUser to fetch userdata for avatar and name on navbar
  const navUser = {};
  if (loggedUser && loggedUser.admin) {
    navUser["admin"] = true;
  } else if (loggedUser && loggedUser.a_id) {
    navUser["staff"] = true;
  } else if (loggedUser && loggedUser.v_id) {
    navUser["volunteer"] = true;
  } else if (loggedUser && loggedUser.f_id) {
    navUser["fellow"] = true;
  }
  // END USERMODE VARIABLE


/* ACCESS STRATEGY (Admins, Staff, Volunteers, Fellows)
- VOLUNTEERS PAGE/DASHBOARD: Admins, Staff
  => Alternate YOUR MENTOR PAGE: Fellows
- EVENTS PAGE/DASHBOARD: All
- FELLOWS PAGE/DASHBOARD: Admins, Staff
  => Alternate MY MENTEES PAGE: Volunteers
  => Alternate MY FELLOWSS PAGE: Staff
- MY ENDEAVOR (VOLUNTEER PUBLIC STAT SHEET)
- ADMIN TOOLS (edit app users, edit cohorts, edit volunteer skills): Admins
*/


  /* DEFINE LIMITED ACCESS NAVS */
  const
    volunteersLink = <NAV_LINK to="/volunteers" text="Volunteers" isBurgerOn={isBurgerOn} />,
    // adminDropdown = (
    //   <NavDropdown topText="Admin">
    //     <NAV_DD_LINK to='/tools/users' text="Edit App Users" isBurgerOn={isBurgerOn} />
    //     <NAV_DD_LINK to='/tools/cohorts' text="Edit Cohorts" isBurgerOn={isBurgerOn} />
    //     <NAV_DD_LINK to='/tools/skills' text="Edit Volunteer Skills" isBurgerOn={isBurgerOn} />
    //   </NavDropdown>
    // ),
    adminLink = <NAV_LINK to="/tools" text="Admin Tools" isBurgerOn={isBurgerOn} />,
    toMenteesLink = <NAV_LINK to="/my_mentees" text="My Mentees" isBurgerOn={isBurgerOn} />,
    toMentorLink = <NAV_LINK to="/my_mentor" text="My Mentor" isBurgerOn={isBurgerOn} />,
    endeavorSheetLink = <NAV_LINK to={`/volunteer/${loggedUser.v_slug}`} text="My Endeavor" isBurgerOn={isBurgerOn} />,
    myFellowsLink = <NAV_LINK to='/my_fellows' text="My Fellows" />
    // fellowsLink = <NAV_LINK to='/fellows' text="Fellows" />, // for general search of fellows
  ;


  /* TOGGLES NULL/SHOW */
  let
    showAdminLink = null,
    // showAdminDropdown = null,
    showVolunteersLink = null,
    showMentoringLink = null,
    showMyFellowsLink = null,
    showEndeavorSheetLink = null;
    // showFellowsLink = null,

  if (navUser.admin) {
    showAdminLink = adminLink;
    // showAdminDropdown = adminDropdown;
  }
  if (navUser.admin || navUser.staff) {
    showVolunteersLink = volunteersLink;
    // showFellowsLink = fellowsLink;
  }
  if (navUser.staff) {
    showMyFellowsLink = myFellowsLink;
  }
  if (navUser.volunteer) {
    showMentoringLink = toMenteesLink;
    showEndeavorSheetLink = endeavorSheetLink;
  }
  if (navUser.fellow) {
    showMentoringLink = toMentorLink;
  }


  return (
    <nav className={`g1Navbar navbar navbar-expand-lg py-2 container`}>
      <Logo />
      <div className="g1NavbarBg"></div>
      <div className="g1Subnav">
        <h1>{h1}</h1>
        <div></div>
      </div>
      <Burger />
      <div className="g1Collapse collapse navbar-collapse bg-dark mt-1 ml-lg-5" id="navbarSupportedContent">
        <ul className="container-lg navbar-nav align-items-start pr-0">
          <div className='flex-fill'></div>

          <NAV_LINK to="/" exact text={navUser.admin ? 'Dashboard' : 'Home'} isBurgerOn={isBurgerOn} />

          {showVolunteersLink}

          <NAV_LINK to='/events' text="Events" isBurgerOn={isBurgerOn} />

          {showMentoringLink}

          {/* {showFellowsLink} */}

          {showMyFellowsLink}

          {showAdminLink}
          {/* {showAdminDropdown} */}

          {showEndeavorSheetLink}

          <NAV_LINK to='/profile' text="My Profile" isBurgerOn={isBurgerOn} />

          <Logout logout={logout} />

        </ul>
      </div>
    </nav>
  );
}


/* NAV COMPONENTS */
const Logo = () => {
  return(
    <Link className="g1Brand navbar-brand py-0" to="/">
      Endea<span>V</span>or
    </Link>
  );
}

const Burger = () => {
  return(
    <button
      className="g1NavbarToggler navbar-toggler navbar-dark"
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

const NAV_LINK = ({ to, exact, text, liClassName = "", isBurgerOn }) => {
  return(
    <li className={`nav-item g1MobileTextALign ${liClassName}`}>
      <span className="g1MobileToggle" data-toggle={isBurgerOn ? "collapse" : ""} data-target="#navbarSupportedContent">
        <NavLink className={`nav-link ${liPadding}`} exact={exact} to={to}>{text}</NavLink>
      </span>
    </li>
  );
}

// const NAV_DD_LINK = ({ to, text, isBurgerOn }) => {
//   return(
//     <span className="g1MobileToggle" data-toggle={isBurgerOn ? "collapse" : ""} data-target="#navbarSupportedContent">
//       <NavLink className="dropdown-item px-3" to={to}>{text}</NavLink>
//     </span>
//   );
// }

// const NavDropdown = (props) => {
//   const { topText, children } = props;

//   return (
//     <li className="g1MobileTextALign nav-item dropdown">
//       <NavLink
//         to="/" // does not affect execution because preventDefault but pointing at /home just in case
//         onClick={(e) => e.preventDefault()}
//         className={`nav-link dropdown-toggle g1MobileTextALign ${liPadding}`}
//         data-toggle="dropdown"
//         role="button"
//         aria-haspopup="true"
//         aria-expanded="false"
//       >
//         {topText}
//       </NavLink>
//       <div className={`g1DropdownMenu dropdown-menu bg-dark`}>
//         {children}
//       </div>
//     </li>
//   );
// }

// const Divider = () => <div className="dropdown-divider"></div> // HIDDEN BECAUSE UNUSED

const Logout = ({logout}) => {
  return(
    <li className={`nav-item g1MobileTextALign`}>
      <button
        className={`nav-link g1BtnAsLink ${logoutLiPadding} pr-2 pr-lg-auto`}
        onClick={logout}
      >
        Logout
      </button>
    </li>
  );
}


export default NavBar;
