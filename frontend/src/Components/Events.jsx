import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventsSearchCard from './EventsCard';


export default function EventSearch(props) {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [filter, setFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    // const [targetEventId, setTargetEventId] = useState(0);
    // const [displayTargetEvent, setDisplayTargetEvent] = useState(false);
   
    // componentDidMount = () => {

    //     this.getAllEvents();
    // }

    const getAllEvents = async () => {
        try {
            const route = `/api/events/all/?${filter}=${search}&${dateFilter}=${dateFilter}`
            console.log(route)
            const { data } = await axios.get(`/api/events/all/?${filter}=${search}&${dateFilter}=${dateFilter}`);
            setResults(data.payload);
        } catch (err) {

        }
    }

    useEffect(getAllEvents, [])

    const handleSubmit = (event) => {
        event.preventDefault();

        getAllEvents();
    }

    return (
        <div className=''>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='Search' value={search}  onChange={e => setSearch(e.target.value)} />
                
                <select className='' value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value=''>Choose a search filter</option>
                    <option value='topic'>Event Name</option>
                    <option value='v_name'>Volunteer</option>
                    <option value='instructor'>Instructor</option>
                </select>

                <select className='' value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
                    <option value=''>Any date</option>
                    <option value='upcoming'>Upcoming events</option>
                    <option value='past'>Past events</option>
                </select>

                <button className='btn btn-primary'>Send</button>
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
