/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
EventsDash Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';
import { Link } from 'react-router-dom';

import { Button, UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import EventListItem from './EventsDash/EventListItem';
const moment = require('moment');


const EventsDash = (props) => {
  const { events } = props;
  console.log(events);

  const
    rowsTodays = events.todays.map(event => {
        return(
          <EventDashRow
            key={event.event_id}
            tableType={"today"}
            event={event}
          />
        );
    }),
    rowsImportants = events.importants.map(event => {
        return(
          <EventDashRow
            key={event.event_id}
            tableType={"important"}
            event={event}
          />
        );
    }),
    rowsUpcomings = events.upcomings.map(event => {
        return(
          <EventDashRow
            key={event.event_id}
            tableType={"upcoming"}
            event={event}
          />
        );
    });

  return(
    <>
    <div className="g1Card card mb-2">
      <h3 className="g1CardHeader card-header"><span>Today's</span> Events</h3>
      <div className="g1CardBody card-body pt-0 pb-1">

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

    {/* <div className="g1Card g1Upcomings card">
      <h3 className="g1CardHeader card-header"><span>On the</span> Horizon</h3>
      <div className="g1CardBody card-body pt-0 pb-1">

        <div className="g1Table">
          <div className="g1Tbody">
            <div className="g1THeader">
              <div className="g1TD g1TopicCol">Event</div>
              <div className="g1TD g1TimeCol">Date / Time</div>
            </div>
            {rowsImportants}

            {rowsUpcomings}
          </div>
        </div>

      </div>
    </div> */}
    </>
  );
}


export default EventsDash;





const EventDashRow = (props) => {
  const { event_id, event_start, event_end, topic, important } = props.event;
  const { tableType } = props;


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
    // showStart = tableType === 'today'
    //   ? ''
    //   : 'Today, ';
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
    <div className={`g1TR ${colorStyle}`}>
      <div className="g1TD g1TopicCol">
        <div id={'event' + event_id} className="g1EventItem">
          {important ? topic + '*' : topic}
        </div>
      </div>
      <div className="g1TD g1TimeCol">
        {showStart}{showEnd}
      </div>
    </div>
  );

  //     <UncontrolledPopover target={'event' + event_id} className="g1PopoverParent" trigger="legacy" placement="left-start">
  //       <PopoverHeader>
  //         <Link to={`/event/edit/${event_id}`} className="g1PopoverGoLink pr-2 pb-3">Go to Event Page</Link>
  //         <strong>{topic}</strong><br />
  //         <div className="times">
  //           {`${evt[type].startTime} - ${evt[type].endTime}`}
  //         </div>
  //       </PopoverHeader>
  //       <PopoverBody>
  //         {content}
  //       </PopoverBody>
  //     </UncontrolledPopover>
  //   </td>
  // </tr>

}