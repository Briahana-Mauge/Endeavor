/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Volunteer Events Dash Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';

import UIModule from '../../UIModule';
import EDashTable from './subcomponents/EDashTable';
import EDashTableRow from './subcomponents/EDashTableRow';


const VolunteerEDash = (props) => {
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
  const rowsPasts = events.pasts.map(event => {
      return(
        <EDashTableRow
          key={'past' + event.event_id}
          tableType={"past"}
          event={event}
          {...operationProps}
        />
      );
  });
  const rowsImportants = events.importants.map(event => {
      return(
        <EDashTableRow
          key={'important' + event.event_id}
          tableType={"important"}
          event={event}
          {...operationProps}
        />
      );
  });


  return(
    <>

      <UIModule className='deepSangria' titleColor='My Two-Week' titleRegular='Glance'>
          <EDashTable>
              {rowsUpcomings.length ? rowsUpcomings : <div className="g1EmptyRowMsg">You have no upcoming events.</div>}
          </EDashTable>
      </UIModule>


      <UIModule className='blueBerry' titleColor='My Last Three' titleRegular='Events'>
          <EDashTable>
              {rowsPasts.length ? rowsPasts : <div className="g1EmptyRowMsg">You have no recent past events.</div>}
          </EDashTable>
      </UIModule>


      <UIModule className='blueBerry' titleColor='Other Pursuit Events' titleRegular='Coming Up'>
          <EDashTable>
              {rowsImportants.length ? rowsImportants : <div className="g1EmptyRowMsg">There are no events to display here.</div>}
          </EDashTable>
      </UIModule>

    </>
  );
}


export default VolunteerEDash;
