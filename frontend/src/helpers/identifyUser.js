/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
User Identifier Helper | Capstone App (Pursuit Volunteer Mgr)
*/


const identifyUser = (loggedUser) => {
  if (loggedUser && loggedUser.admin) {
    return {"admin": true};
  } else if (loggedUser && loggedUser.a_id) {
    return {"staff": true};
  } else if (loggedUser && loggedUser.v_id) {
    return {"volunteer": true};
  } else if (loggedUser && loggedUser.f_id) {
    return {"fellow": true};
  } else {
    return {};
  }
}


module.exports = identifyUser;
