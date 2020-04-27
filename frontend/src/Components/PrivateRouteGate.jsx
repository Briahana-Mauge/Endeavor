/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
PrivateRouteGate Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import NavBar from './NavBar/NavBar';


const PrivateRouteGate = ({ children, loggedUser, logout, isUserStateReady, ...rest }) => {
  // without this showInside, logout is visibly delayed for fraction of a second before redirect
  let showInside = null;
  if (isUserStateReady) {
    showInside = children;
  }

  return (
    <>
      <NavBar loggedUser={loggedUser} logout={logout} />
      <Route
        {...rest}
        render={({location}) =>
          loggedUser && (loggedUser.a_id || loggedUser.f_id || loggedUser.v_id)
            ? ( showInside )
            : ( <Redirect
                  to={{
                    pathname: '/login',
                    state: { from: location }
                  }}
                />
              )
        }
      />
    </>
  );
}


export default PrivateRouteGate;
