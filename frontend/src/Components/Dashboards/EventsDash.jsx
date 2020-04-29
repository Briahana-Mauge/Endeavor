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

  const rowsTodays = events.todays.map(event => {
      return(
        <EventDashRow
          key={event.event_id}
          type={"today"}
          event={event}
        />
      );
  });

  return(
    <>
    <div className="g1Card card mb-2">
      <h3 className="g1CardHeader card-header"><span>Today's</span> Events</h3>
      <div className="g1CardBody card-body pt-0 pb-1">

        {/* TODAY'S TABLE */}
        <table className="g1TableEvents table table-striped">
          <thead>
            <tr>
              <th scope="col" className="topicCol">Event</th>
              <th scope="col" className="timeCol">Time / Date</th>
            </tr>
          </thead>
          <tbody>
            {rowsTodays}
          </tbody>
        </table>
        {/* END TODAY'S TABLE*/}
      </div>
    </div>

    <div className="g1Card card">
      <h3 className="g1CardHeader card-header"><span>On the</span> Horizon</h3>
      <div className="g1CardBody card-body pt-0 pb-1">
        {/* IMPORTANTS TABLE */}
        <table className="g1TableEvents table table-striped">
          <thead>
            <tr>
              <th scope="col" className="topicCol">Event</th>
              <th scope="col" className="timeCol">Time / Date</th>
            </tr>
          </thead>
          <tbody>
            {rowsTodays}
            <tr>
              <td className="topicCol" colSpan="2">
                &nbsp;
              </td>
            </tr>
            {rowsTodays}
          </tbody>
        </table>
        {/* END IMPORTANTS TABLE*/}

      </div>
    </div>
    </>
  );
}


export default EventsDash;





const EventDashRow = (props) => {
  const { event_id, event_start, event_end, topic, important } = props.event;
  const { type } = props;


  /*
  ASSERTING:
    all events passed into this component are either active at any point today or are in the future
  */

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
    showStart = moment(event_start).format('MMM D');  // start hour becomes irrelevant in past
  } else if (startsToday && isOneDay) {
    showStart = isMidnightToMidnight
      ? 'Today, All-Day'
      : 'Today' + moment(event_start).format(', h:mma');
  } else {
    showStart = isMidnightToMidnight
      ? moment(event_start).format('MMM D')
      : moment(event_start).format('MMM D, h:mma');
  }

  if (!isOneDay) {
    showEnd = endsToday
      ? ' - Ends Today'
      : moment(event_end).format(' - MMM D');
    if (!isMidnightToMidnight) {
      showEnd += moment(event_end).format(', h:mma');
    }
  } else if (!isMidnightToMidnight) {
    showEnd = moment(event_end).format(' - h:mma');
  }


  return(
    <tr className={colorStyle}>
      <td className="topicCol">
        <div id={'event' + event_id} className="g1EventItem">
          {topic}
        </div>
      </td>
      <td className="timeCol">
        {showStart}{showEnd}
      </td>
    </tr>
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