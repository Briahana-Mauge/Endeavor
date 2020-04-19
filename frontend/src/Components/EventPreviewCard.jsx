import React from 'react';


export default function EventPreviewCard(props) {
    const { event } = props;

    const formatEventDate = date => {
        const d = new Date(date).toLocaleDateString();
        const t = new Date(date).toLocaleTimeString();
        return `${d} ${t.slice(0, -6)} ${t.slice(-2)}`;
    }

    return (
        <div className='row border rounded-lg m-2'>
            <div className='col-6'>
                <p className='' onClick={e => props.displayEvent(event)}><strong>Topic: </strong>{event.topic}</p>
                <p><strong>Starts: </strong>{formatEventDate(event.event_start)}</p>
                <p><strong>Ends: </strong>{formatEventDate(event.event_end)}</p>
                <p><strong>Host: </strong>{event.instructor}</p>
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