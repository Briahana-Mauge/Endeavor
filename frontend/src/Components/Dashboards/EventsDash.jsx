/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
EventsDash Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';
import { Link } from 'react-router-dom';

import { Button, UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
const moment = require('moment');


const EventsDash = (props) => {
  const { todays, importants, upcomings } = props.events;
  console.log(importants, todays, upcomings);

  const rowsTodays = todays.map(event => {
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
  const { event_id, event_start, event_end, topic, location, description } = props.event;
  const { type } = props;

  // const formatTime = (dateObj, modeStr) => {
  //   switch (modeStr) {
  //     case "todayEvent":
  //       return moment(dateObj).format('h:mm a');
  //       break;
  //     case "otherEvents":
  //       return moment(dateObj).format('D MMM YY');
  //       break;
  //   }
  // }
  const evt = {
    today: {
      startTime: moment(event_start).format('h:mm a'),  // to do: add conditionals for start time diff day and all-day
      endTime: moment(event_end).format('h:mm a')
    },
    important: {
      startDate: moment(event_start).format('D MMM YY')
    }
  }


  const content = (
    <div>
      {/* volunteers confirmed / requested / pending */}
      <p>{description}</p>
      <p>{location}</p>
    </div>
  );

  return(
    <tr>
      <td className="topicCol">
        <Button id={'event' + event_id} type="button" className="g1PopoverBtn">
          {topic}
        </Button>
      </td>
      <td className="timeCol">
        {evt[type].startTime}

        <UncontrolledPopover target={'event' + event_id} className="g1PopoverParent" trigger="legacy" placement="left-start">
          <PopoverHeader>
            <Link to={`/event/edit/${event_id}`} className="g1PopoverGoLink pr-2 pb-3">Go to Event Page</Link>
            <strong>{topic}</strong><br />
            <div className="times">
              {`${evt[type].startTime} - ${evt[type].endTime}`}
            </div>
          </PopoverHeader>
          <PopoverBody>
            {content}
          </PopoverBody>
        </UncontrolledPopover>
      </td>
    </tr>
  );
}