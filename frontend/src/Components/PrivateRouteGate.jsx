/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
PrivateRouteGate Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';
import { Redirect } from 'react-router-dom';


const PrivateRouteGate = ({ loggedUser, children, isUserStateReady, location }) => {
  // this show mechanism is needed to hide private elements before redirect & after clicking logout
  let showPrivateChildren = null;
  if (isUserStateReady) {
    showPrivateChildren = children;
  }


  return(
    <>
      {loggedUser && (loggedUser.a_id || loggedUser.f_id || loggedUser.v_id)
        ? showPrivateChildren
        : <Redirect to={{ pathname: '/', state: { from: location }}} />
      }
    </>
  );
};

export default PrivateRouteGate;
