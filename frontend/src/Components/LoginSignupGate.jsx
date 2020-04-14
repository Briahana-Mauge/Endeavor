/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
LoginSignupGate Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';
import { Redirect } from 'react-router-dom';


const LoginSignupGate = ({ loggedUser, isUserStateReady, children }) => {
  // this show mechanism is needed to hide login elements before redirect
  let showLoginSignup = null;
  if (isUserStateReady) {
    showLoginSignup = children;
  }


  return(
    <>
      {loggedUser && (loggedUser.a_id || loggedUser.f_id || loggedUser.v_id)
        ? <Redirect to={{ pathname: '/home'}} />
        : showLoginSignup
      }
    </>
  );
};

export default LoginSignupGate;
