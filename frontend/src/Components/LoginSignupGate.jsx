/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
LoginSignupGate Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';
import { Redirect } from 'react-router-dom';


const LoginSignupGate = (props) => {
  // this show mechanism is needed to hide login elements before redirect
  let showLoginSignup = null;
  if (props.isUserStateReady) {
    showLoginSignup = props.children;
  }


  return(
    <>
      {props.currentRole
        ? <Redirect to={{ pathname: '/home'}} />
        : showLoginSignup
      }
    </>
  );
};

export default LoginSignupGate;
