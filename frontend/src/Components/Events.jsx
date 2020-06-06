import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import UIResultsModeToggle from './UIResultsModeToggle';
import EventPreviewCard from './EventPreviewCard';
import { PrimaryModalContainer } from './Modals/PrimaryModal';
import EventCard from './EventCard';
// import EventRender from './EventRender';


export default function Events(props) {
    const history = useHistory();
    const { setFeedback, loggedUser, isEventSearchGrided, setIsEventSearchGrided } = props;

    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [filter, setFilter] = useState('');
    const [pastOrUpcoming, setPastOrUpcoming] = useState('');
    const [reload, setReload] = useState(false); 
    
    const [targetEvent, setTargetEvent] = useState({});
    const [showEvent, setShowEvent] = useState(false);


    useEffect(() => {
        let isMounted = true;
        let dateFilter = '';
        if (pastOrUpcoming === 'upcoming' || pastOrUpcoming === 'past') {
            dateFilter = 'true'
        }
        if (props.loggedUser && props.loggedUser.a_id) {
            axios.get(`/api/events/admin/all/?${filter}=${search}&${pastOrUpcoming}=${dateFilter}`)
                .then(response => {
                    if (isMounted) {
                        setResults(response.data.payload);
                    }
                })
                .catch(err => {
                    if (isMounted) {
                        setFeedback(err);
                    }
                })
        } else {
            axios.get(`/api/events/admin/all/?${filter}=${search}&${pastOrUpcoming}=${dateFilter}`)
            // axios.get(`/api/events/all/?${filter}=${search}&${pastOrUpcoming}=${dateFilter}`)
                .then(response => {
                    if (isMounted) {
                        setResults(response.data.payload);
                    }
                })
                .catch(err => {
                    if (isMounted) {
                        setFeedback(err);
                    }
                })
        }

        //Cleanup
        return () => isMounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload, filter, pastOrUpcoming]);


    const handleSearch = (e) => {
        e.preventDefault();
        setReload(!reload);
    }

 
    const hideEvent = () => {
        setShowEvent(false);
        setTargetEvent({});
    }


    return (
        <>
            {
                loggedUser && loggedUser.a_id
                ?   <>
                        <div className='text-right'>
                            <button className='btn btn-primary' onClick={e => history.push('/event/add')}>Add Event</button>
                        </div>
                        <hr />
                    </>

                : null
            }

            {/* Search form */}
            <form className='form-inline' onSubmit={handleSearch}>
                <input className='form-control mb-2 mr-sm-2 min-w-25' type='text' 
                    placeholder='Search' value={search}  onChange={e => setSearch(e.target.value)} />
                
                <select className='form-control mb-2 mr-sm-2' value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value=''>Choose a search filter</option>
                    <option value='topic'>Event Name</option>
                    <option value='v_name'>Volunteer</option>
                    <option value='instructor'>Instructor</option>
                </select>

                <select className='form-control mb-2 mr-sm-2' value={pastOrUpcoming} onChange={e => setPastOrUpcoming(e.target.value)}>
                    <option value=''>Any date</option>
                    <option value='upcoming'>Upcoming events</option>
                    <option value='past'>Past events</option>
                </select>

                <button className='btn btn-primary mb-2'>Search</button>
            </form>

            {/* List or grid toggle */}
            <UIResultsModeToggle
                isDisplayModeGrid={isEventSearchGrided}
                setIsDisplayModeGrid={setIsEventSearchGrided}
            />

            {/* Search results */}
            <div className={`g1EventsResults ${isEventSearchGrided ? 'g1GridResults' : 'g1ListResults'}`}>
                {
                    results.map(event => <EventPreviewCard 
                        key={event.event_id + event.event_end + event.event_start}
                        loggedUser={loggedUser}
                        event={event}
                        setShowEvent={setShowEvent}
                        targetEvent={targetEvent}
                        setTargetEvent={setTargetEvent}
                        isEventSearchGrided={isEventSearchGrided}
                    />)
                }
            </div>
            
            <PrimaryModalContainer header={targetEvent.topic} runOnModalClose={hideEvent}>
                {
                    showEvent
                        ?   <EventCard
                                loggedUser={loggedUser}
                                event={targetEvent}
                                setFeedback={setFeedback}
                                reloadParent={reload}
                                setReloadParent={setReload}
                                hideEvent={hideEvent}
                            />
                        :   null
                }
            </PrimaryModalContainer>
            {/* {
                showEvent 
                ?   <EventRender 
                        loggedUser={loggedUser} 
                        event={targetEvent}
                        setFeedback={setFeedback}
                        reloadParent={reload}
                        setReloadParent={setReload}
                        hideEvent={hideEvent}
                    />
                :   null
            } */}
        </>
    );
}

