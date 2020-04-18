import React from 'react';


export default function EventPreviewCard(props) {
    const { event } = props;

    return (
        <div className='row border rounded-lg m-2'>
            <div className='col-6'>
                <p className='' onClick={e => props.displayEvent(event)}><strong>Topic: </strong>{event.topic}</p>
                <p><strong>Starts: </strong>{new Date(event.event_start).toLocaleString()}</p>
                <p><strong>Ends: </strong>{new Date(event.event_end).toLocaleString()}</p>
                <p><strong>Open to: </strong>{event.cohort}</p>
            </div>

            <div className='col-6'>
                <ul> <strong>Volunteers: </strong>
                    {
                        event.volunteers.length === 1 && event.volunteers[0] === null
                        ? '0 / ' + event.volunteers_needed
                        : <>
                            {event.volunteers.length + ' / ' + event.volunteers_needed}
                            {event.volunteers.map(volunteers => <li key={volunteers}>{volunteers}</li>)}
                        </>
                    }
                </ul>
            </div>
        </div>
    )
}