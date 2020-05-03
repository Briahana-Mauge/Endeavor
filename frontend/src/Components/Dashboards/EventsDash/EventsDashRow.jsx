/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
EventsDashRow Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';

import EventListItem from './EventListItem';
const moment = require('moment');


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
    showEnd = <></>;  // using jsx type here to inject <u> tags below for styling transition markers in date/time string
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
  } else if (isMidnightToMidnight) {
    showStart = moment(event_start).format('MMM Do');
  } else {
    showStart = isOneDay
      ? simplifyHours(moment(event_start).format('MMM Do, h:mm'))
      : simplifyHours(moment(event_start).format('MMM Do, h:mma'));
  }

  if (!isOneDay) {
    let tempString = endsToday
      ? 'Today'
      : moment(event_end).format('MMM Do');
    if (!isMidnightToMidnight) {
      tempString += simplifyHours(moment(event_end).format(', h:mma'));
    }
    showEnd = <><u> to </u>{tempString}</>;
  } else if (!isMidnightToMidnight) {
    showEnd = <><u> – </u>{simplifyHours(moment(event_end).format('h:mma'))}</>;
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


export default EventsDashRow;
