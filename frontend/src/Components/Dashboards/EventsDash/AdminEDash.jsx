/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Admin Events Dash Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';

import UIModule from '../../UIModule';
import EDashTable from './subcomponents/EDashTable';
import EDashTableRow from './subcomponents/EDashTableRow';


const AdminEDash = (props) => {
  const {
    events, //  used by this component
    loggedUser, setShowEvent, targetEvent, setTargetEvent // drilled props needed for operations
  } = props;
  const operationProps = {
    loggedUser,
    setShowEvent,
    targetEvent,
    setTargetEvent
  }


  const rowsTodays = events.todays.map(event => {
      return(
        <EDashTableRow
          key={'today' + event.event_id}
          tableType={"today"}
          event={event}
          {...operationProps}
        />
      );
  });
  // const rowsImportants = events.importants.map(event => {
  //     return(
  //       <EDashTableRow
  //         key={'important' + event.event_id}
  //         tableType={"important"}
  //         event={event}
  //         {...operationProps}
  //       />
  //     );
  // });
  const rowsUpcomings = events.upcomings.map(event => {
      return(
        <EDashTableRow
          key={'upcoming' + event.event_id}
          tableType={"upcoming"}
          event={event}
          {...operationProps}
        />
      );
  });


  return(
    <>

      <UIModule className='deepSangria' titleColor="Today" titleRegular=''>
        <EDashTable>
          {rowsTodays.length ? rowsTodays : <div className="g1EmptyRowMsg">There are no events today.</div>}
        </EDashTable>
      </UIModule>

      {/* <UIModule className='deepSangria' titleColor="Upcoming" titleRegular='Major Events'>
        <EDashTable>
          {rowsImportants.length ? rowsImportants : <div className="g1EmptyRowMsg">There are no upcoming important dates at the moment.</div>}
        </EDashTable>
      </UIModule> */}

      <UIModule className='deepSangria' titleColor="Two Week" titleRegular='Glance'>
        <EDashTable>
          {rowsUpcomings.length ? rowsUpcomings : <div className="g1EmptyRowMsg">There are no upcoming events at the moment.</div>}
        </EDashTable>
      </UIModule>

    </>
  );
}


export default AdminEDash;
