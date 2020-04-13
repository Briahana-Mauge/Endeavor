/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
PrivateRouteGate Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';
import { Redirect } from 'react-router-dom';


const PrivateRouteGate = (props) => {
  // this show mechanism is needed to hide private elements before redirect & after clicking logout
  let showPrivateChildren = null;
  if (props.isUserStateReady) {
    showPrivateChildren = props.children;
  }


  return(
    <>
      {props.currentRole
        ? showPrivateChildren
        : <Redirect to={{ pathname: '/', state: { from: props.location }}} />
      }
    </>
  );
};

export default PrivateRouteGate;
