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
  const { events } = props;

  const upcomingsHash = {};
  const rowsUpcomings = events.upcomings.map(event => {
      upcomingsHash[event.event_id] = true;
      return(
        <EDashTableRow
          key={'upcoming' + event.event_id}
          tableType={"upcoming"}
          event={event}
        />
      );
  });
  const rowsPasts = events.pasts.map(event => {
      return(
        <EDashTableRow
          key={'past' + event.event_id}
          tableType={"past"}
          event={event}
        />
      );
  });
  const rowsImportants = events.importants.filter(event => !upcomingsHash[event.event_id])
      .map(event => {
          return(
            <EDashTableRow
              key={'important' + event.event_id}
              tableType={"important"}
              event={event}
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


      <UIModule className='blueBerry' titleColor='Other Upcoming Pursuit' titleRegular='Events'>
          <EDashTable>
              {rowsImportants.length ? rowsImportants : <div className="g1EmptyRowMsg">There are no events to display here.</div>}
          </EDashTable>
      </UIModule>

    </>
  );
}


export default VolunteerEDash;
