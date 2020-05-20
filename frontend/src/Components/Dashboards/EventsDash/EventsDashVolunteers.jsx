/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
EventsDashVolunteers Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';

import UIModule from '../../UIModule';
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
  const rowsPasts = events.pasts.map(event => {
      return(
        <EventsDashRow
          key={'past' + event.event_id}
          tableType={"past"}
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

  // const xPadding = "px-2";


  return(
    <>
      <UIModule className='upcomingEventsModule' titleColor='My Upcoming' titleRegular='Events'>
          <div role="grid" className="g1Table">
            <div role="row" className="g1THead">
              <div role="gridcell" className="g1TD g1TopicCol">Event</div>
              <div role="gridcell" className="g1TD g1TimeCol">Date / Time</div>
            </div>
            <div className="g1TBody">
              {rowsUpcomings.length ? rowsUpcomings : <div className="g1EmptyRowMsg">You have no upcoming events.</div>}
            </div>
          </div>
      </UIModule>
      {/* <div className="g1Module card mb-2">
        <h3 className={`g1Module__header card-header ${xPadding}`}><span>My Upcoming</span> Events</h3>
        <div className={`g1Module__body card-body pt-0 pb-1 ${xPadding}`}>

          <div role="grid" className="g1Table">
            <div role="row" className="g1THead">
              <div role="gridcell" className="g1TD g1TopicCol">Event</div>
              <div role="gridcell" className="g1TD g1TimeCol">Date / Time</div>
            </div>
            <div className="g1TBody">
              {rowsUpcomings.length ? rowsUpcomings : <div className="g1EmptyRowMsg">You have no upcoming events.</div>}
            </div>
          </div>

        </div>
      </div> */}

      <UIModule className='pastEventsModule' titleColor='My Previous' titleRegular='(3) Events'>
          <div role="grid" className="g1Table">
            <div role="row" className="g1THead">
              <div role="gridcell" className="g1TD g1TopicCol">Event</div>
              <div role="gridcell" className="g1TD g1TimeCol">Date / Time</div>
            </div>
            <div className="g1TBody">
              {rowsPasts.length ? rowsPasts : <div className="g1EmptyRowMsg">You have no past recent events.</div>}
            </div>
          </div>
      </UIModule>
      {/* <div className="g1Module g1CardPast card mb-2">
        <h3 className={`g1Module__header card-header ${xPadding}`}><span>My Previous</span> Three Events</h3>
        <div className={`g1Module__body card-body pt-0 pb-1 ${xPadding}`}>

          <div role="grid" className="g1Table">
            <div role="row" className="g1THead">
              <div role="gridcell" className="g1TD g1TopicCol">Event</div>
              <div role="gridcell" className="g1TD g1TimeCol">Date / Time</div>
            </div>
            <div className="g1TBody">
              {rowsPasts.length ? rowsPasts : <div className="g1EmptyRowMsg">You have no past recent events.</div>}
            </div>
          </div>

        </div>
      </div> */}

      <UIModule className='importantEventsModule' titleColor='Important' titleRegular='Pursuit Dates'>
          <div role="grid" className="g1Table">
            <div role="row" className="g1THead">
              <div role="gridcell" className="g1TD g1TopicCol">Event</div>
              <div role="gridcell" className="g1TD g1TimeCol">Date / Time</div>
            </div>
            <div className="g1TBody">
              {rowsImportants.length ? rowsImportants : <div className="g1EmptyRowMsg">There are no upcoming important dates at the moment.</div>}
            </div>
          </div>
      </UIModule>
      {/* <div className="g1Module g1CardImportant card mb-2">
        <h3 className={`g1Module__header card-header ${xPadding}`}><span>Important</span> Pursuit Dates</h3>
        <div className={`g1Module__body card-body pt-0 pb-1 ${xPadding}`}>

          <div role="grid" className="g1Table">
            <div role="row" className="g1THead">
              <div role="gridcell" className="g1TD g1TopicCol">Event</div>
              <div role="gridcell" className="g1TD g1TimeCol">Date / Time</div>
            </div>
            <div className="g1TBody">
              {rowsImportants.length ? rowsImportants : <div className="g1EmptyRowMsg">There are no upcoming important dates at the moment.</div>}
            </div>
          </div>

        </div>
      </div> */}
    </>
  );
}


export default EventsDash;
