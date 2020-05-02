/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
EventsDash Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';

import EventsDashRow from './EventsDashRow';


const EventsDash = (props) => {
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
        <EventsDashRow
          key={'today' + event.event_id}
          tableType={"today"}
          event={event}
          {...operationProps}
        />
      );
  });
  const rowsImportants = events.importants.map(event => {
      return(
        <EventsDashRow
          key={'important' + event.event_id}
          tableType={"important"}
          event={event}
          {...operationProps}
        />
      );
  });
  const rowsUpcomings = events.upcomings.map(event => {
      return(
        <EventsDashRow
          key={'upcoming' + event.event_id}
          tableType={"upcoming"}
          event={event}
          {...operationProps}
        />
      );
  });

  const xPadding = "px-2";


  return(
    <>
      <div className="g1Card card mb-2">
        <h3 className={`g1CardHeader card-header ${xPadding}`}><span>Today's</span> Events</h3>
        <div className={`g1CardBody card-body pt-0 pb-1 ${xPadding}`}>

          <div role="grid" className="g1Table">
            <div role="row" className="g1THead">
              <div role="gridcell" className="g1TD g1TopicCol">Event</div>
              <div role="gridcell" className="g1TD g1TimeCol">Date / Time</div>
            </div>
            <div className="g1TBody">
              {rowsTodays}
            </div>
          </div>

        </div>
      </div>

      <div className="g1Card card mb-2">
        <h3 className={`g1CardHeader card-header ${xPadding}`}><span>On the</span> Horizon</h3>
        <div className={`g1CardBody card-body pt-0 pb-1 ${xPadding}`}>

          <div role="grid" className="g1Table">
            <div role="row" className="g1THead">
              <div role="gridcell" className="g1TD g1TopicCol">Event</div>
              <div role="gridcell" className="g1TD g1TimeCol">Date / Time</div>
            </div>
            <div className="g1TBody">
              {rowsImportants}
            </div>
            <div className="g1TBody g1BufferRow">
              <div role="row" className="g1TR">
                <div role="gridcell" className="g1TD"></div>
                <div role="gridcell" className="g1TD"></div>
              </div>
            </div>
            <div className="g1TBody">
              {rowsUpcomings}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}


export default EventsDash;
