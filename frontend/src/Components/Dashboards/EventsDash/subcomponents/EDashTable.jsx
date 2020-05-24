/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Events Dashboard Table Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';


const EDashTable = ({ children }) => {
  return(
    <div role="grid" className="g1Table">
      <div role="row" className="g1THead">
        <div role="gridcell" className="g1TD g1TopicCol">Event</div>
        <div role="gridcell" className="g1TD g1TimeCol">Date / Time</div>
      </div>
      <div className="g1TBody">

        {children}

      </div>
    </div>
  );
}


export default EDashTable;