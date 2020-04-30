/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
EventsDash Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';

import EventListItem from './EventsDash/EventListItem';
const moment = require('moment');


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
  console.log(events);

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





const EventsDashRow = (props) => {
  const { event_id, event_start, event_end, topic, important } = props.event;
  // const { tableType } = props;
  const {
    event, loggedUser, setShowEvent, targetEvent, setTargetEvent // drilled props needed for operations
  } = props;
  const operationProps = {
    event,
    loggedUser,
    setShowEvent,
    targetEvent,
    setTargetEvent
  }


  /*
  ASSERTING:
    all events passed into this component are either active at any point today or are in the future
  */

  const simplifyHours = (momentString) => {
    if (momentString.slice(-3) === ':00') {
      return momentString.slice(0, -3);
    } else if (momentString.slice(-5, -2) === ':00') {
      return momentString.slice(0, -5) + momentString.slice(-2, -1);
    } else if (momentString.slice(-2) === 'am' || momentString.slice(-2) === 'pm') {
      return momentString.slice(0, -1);
    } else {
      return momentString;
    }
  }

  let
    colorStyle = "",
    showStart = "",
    showEnd = "";
  const
    hasEnded = moment(event_end).isBefore(moment(), 'second'),
    hasStarted = moment(event_start).isBefore(moment(), 'second'),
    startedBeforeToday = moment(event_start).isBefore(moment(), 'day'),
    startsToday = moment(event_start).format('L') === moment().format('L'),
    endsToday = moment(event_end).format('L') === moment().format('L'),
    isOneDay = moment(event_start).format('L') === moment(event_end).format('L'),  // starts and ends on same date
    isMidnightToMidnight = moment(event_start).format('HHmm') === '0000' && moment(event_end).format('HHmm') === '2359'; // 00:00 - 23:59

  if (hasEnded) {
    colorStyle = 'passed';
  } else if (hasStarted) {  // CURRENTLY ONGOING
    colorStyle = 'ongoing';
  } else if (important) {
    colorStyle = 'important';
  }

  if (startedBeforeToday) {
    showStart = moment(event_start).format('MMM Do');  // start hour becomes irrelevant in past
  } else if (startsToday && isOneDay) {
    showStart += isMidnightToMidnight
      ? 'All-Day'
      : simplifyHours(moment(event_start).format('h:mm'));
  } else {
    showStart = isMidnightToMidnight
      ? moment(event_start).format('MMM Do')
      : simplifyHours(moment(event_start).format('MMM Do, h:mm'));
  }

  if (!isOneDay) {
    showEnd = endsToday
      ? ' to Today'
      : moment(event_end).format(' to MMM Do');
    if (!isMidnightToMidnight) {
      showEnd += simplifyHours(moment(event_end).format(', h:mma'));
    }
  } else if (!isMidnightToMidnight) {
    showEnd = simplifyHours(moment(event_end).format(' – h:mma'));
  }


  return(
    <div role="row" className={`g1TR ${colorStyle}`}>
      <div role="gridcell" className="g1TD g1TopicCol">

        <div id={'event' + event_id} className="g1EventItem">
          <EventListItem {...operationProps} className="g1EventLink">
            {topic}
          </EventListItem>
        </div>

      </div>
      <div role="gridcell" className="g1TD g1TimeCol">
        {showStart}{showEnd}
      </div>
    </div>
  );
}