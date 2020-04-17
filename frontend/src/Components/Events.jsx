import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventsSearchCard from './EventsCard';

import EventForm from './EventForm';

export default function EventSearch(props) {
    const { setFeedback, loggedUser } = props;
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [filter, setFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [reload, setReload] = useState(0); 
    const [displayEventForm, setDisplayEventForm] = useState(false);
    // const [targetEventId, setTargetEventId] = useState(0);
    // const [displayTargetEvent, setDisplayTargetEvent] = useState(false);
   

    
    useEffect(() => {
        const getAllEvents = async () => {
            try {
                const { data } = await axios.get(`/api/events/all/?${filter}=${search}&${dateFilter}=${dateFilter}`);
                setResults(data.payload);
            } catch (err) {
                setFeedback(err)
            }
        }

        getAllEvents()
    }, [setFeedback, reload]);

    const handleSubmit = (event) => {
        event.preventDefault();

        setReload(reload + 1);
    }

    const hideEventForm = () => {
        setDisplayEventForm(false);
        setReload(reload + 1);
    }

    return (
        <div className=''>
            {
                loggedUser && loggedUser.a_id
                ? <>
                    <div className='text-right'>
                        <button className='btn btn-primary' onClick={e => setDisplayEventForm(true)}>Add Event</button>
                    </div>
                    {
                        displayEventForm
                        ? <EventForm setFeedback={setFeedback} hideEventForm={hideEventForm} />
                        : null
                    }
                </>
                : null
            }

            <hr />
            <h3>Events: </h3>
            <form className='form-inline' onSubmit={handleSubmit}>
                <input className='form-control mb-2 mr-sm-2 w-25' type='text' placeholder='Search' value={search}  onChange={e => setSearch(e.target.value)} />
                
                <select className='form-control mb-2 mr-sm-2' value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value=''>Choose a search filter</option>
                    <option value='topic'>Event Name</option>
                    <option value='v_name'>Volunteer</option>
                    <option value='instructor'>Instructor</option>
                </select>

                <select className='form-control mb-2 mr-sm-2' value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
                    <option value=''>Any date</option>
                    <option value='upcoming'>Upcoming events</option>
                    <option value='past'>Past events</option>
                </select>

                <button className='btn btn-primary mb-2'>Send</button>
            </form>
            
            <div className='d-flex flex-wrap justify-content-around'>
                {results.map(event => {
                    return (
                        <div key={event.event_id}>
                            <EventsSearchCard event={event} />
                        </div>
                    )
                })}
            </div>


        </div>
    );
}
