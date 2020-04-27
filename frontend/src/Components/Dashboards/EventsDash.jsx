/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
EventsDash Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';

import { Button, UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';


const EventsDash = (props) => {
  const { todays, importants, upcomings } = props.events;
  console.log(importants, todays, upcomings);

  const rowsTodays = todays.map(event => {
      return(
        <EventDashRow
          key={event.event_id}
          event={event}
        />
      );
  });

  return(
    <div className="g1Card card">
      <h3 className="g1CardHeader card-header"><span>Today's</span> Events</h3>
      <div className="g1CardBody card-body">

      {/* TABLE */}
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
        {/* END TABLE*/}

      </div>
    </div>
  );
}


export default EventsDash;


const EventDashRow = (props) => {
  const { event_id, topic, location, description } = props.event;

  const content = (
    <div>
      <p>{location}</p>
      <p>{description}</p>
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
        Date

        <UncontrolledPopover target={'event' + event_id} className="g1PopoverParent" trigger="legacy" placement="left-start">
          <PopoverHeader>{topic}</PopoverHeader>
          <PopoverBody>
            {content}
          </PopoverBody>
        </UncontrolledPopover>
      </td>
    </tr>
  );
}