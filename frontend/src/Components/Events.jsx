import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventsSearchCard from './EventsCard';


export default function EventSearch(props) {
    const { setFeedback } = props;
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [filter, setFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [reload, setReload] = useState(0);
    // const [targetEventId, setTargetEventId] = useState(0);
    // const [displayTargetEvent, setDisplayTargetEvent] = useState(false);



    useEffect(() => {
        const getAllEvents = async () => {
            try {
                if (props.loggedUser && props.loggedUser.a_id) {
                    const { data } = await axios.get(`/api/events/admin/all/?${filter}=${search}&${dateFilter}=${dateFilter}`);
                    setResults(data.payload);
                }
                else {
                    const { data } = await axios.get(`/api/events/all/?${filter}=${search}&${dateFilter}=${dateFilter}`);
                    setResults(data.payload);
                }

            } catch (err) {
                setFeedback(err)
            }
        }

        getAllEvents();
    }, [setFeedback, reload]);

    const handleSubmit = (event) => {
        event.preventDefault();

        setReload(reload + 1);
    }

    const handleDelete = async (event, id) => {
        try {
            event.preventDefault();
            await axios.delete(`/api/events/${id}`)
            setReload(reload + 1);
        } catch (err) {
            setFeedback(err);
        }
    }





    return (
        // {(props.loggedUser && props.loggedUser.a_id)? 
//     :
// }
<div className=''>
    <form className='form-inline' onSubmit={handleSubmit}>
        <input className='form-control mb-2 mr-sm-2 w-25' type='text' placeholder='Search' value={search} onChange={e => setSearch(e.target.value)} />

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
                    <EventsSearchCard role = {props.loggedUser.admin} event={event} delete={handleDelete} /* edit = {} */ />
                </div>
            )
        })}
    </div>


</div>
    );
}
