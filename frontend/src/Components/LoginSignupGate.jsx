/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
LoginSignupGate Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';
import { Redirect } from 'react-router-dom';


const LoginSignupGate = ({ loggedUser, isUserStateReady, children }) => {
  // without this showLoginSignup, login screen will show for fraction of a second before redirect if user is already logged in
  let showLoginSignup = null;
  if (isUserStateReady) {
    showLoginSignup = children;
  }

  return(
    <>
      {loggedUser && (loggedUser.a_id || loggedUser.f_id || loggedUser.v_id)
        ? <Redirect to={{ pathname: '/'}} />
        : showLoginSignup
      }
    </>
  );
};

export default LoginSignupGate;
