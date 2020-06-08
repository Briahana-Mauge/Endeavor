import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import axios from 'axios';

import UIResultsModeToggle from './UIResultsModeToggle';
import EventPreviewCard from './EventPreviewCard';
// import { PrimaryModalContainer } from './Modals/PrimaryModal';
// import EventCard from './EventCard';
// import EventRender from './EventRender';


export default function Events(props) {
    const { search } = useLocation();
    const history = useHistory();
    const { setFeedback, loggedUser, isEventSearchGrided, setIsEventSearchGrided } = props;

    const getQueryStrings = () => {
        const values = queryString.parse(search);
        const date = values.date;
        delete values.date;
        const key = Object.keys(values);
        const value = Object.values(values);

        return [date, key, value];
    }

    const [searchValue, setSearchValue] = useState('');
    const [filter, setFilter] = useState('');
    const [pastOrUpcoming, setPastOrUpcoming] = useState('upcoming');
    
    const [strQueryPastOrUpcoming, strQueryFilter, strQuerySearchValue] = getQueryStrings();
    const [urlSearchValue, setUrlSearchValue] = useState(strQuerySearchValue || '');
    const [urlFilter, setUrlFilter] = useState(strQueryFilter || '');
    const [urlPastOrUpcoming, setUrlPastOrUpcoming] = useState(strQueryPastOrUpcoming || 'upcoming');

    const [results, setResults] = useState([]);
    const [targetEvent, setTargetEvent] = useState({});
    const [showEvent, setShowEvent] = useState(false);
    const [reload, setReload] = useState(false); 


    useEffect(() => {
        const [date, searchKey, searchVal] = getQueryStrings();

        setSearchValue(searchVal || '');
        setFilter(searchKey || '');
        setPastOrUpcoming(date || 'upcoming');

        let isMounted = true;

        if (props.loggedUser && props.loggedUser.a_id) {
            axios.get(`/api/events/admin/all/?${searchKey}=${searchVal}&${date}=true`)
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
            axios.get(`/api/events/admin/all/?${searchKey}=${searchVal}&${date}=true`)
            // axios.get(`/api/events/all/?${searchKey}=${searchVal}&${date}=${dateFilter}`)
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
    }, [reload, search]);


    useEffect(() => {
        history.push(`/events?date=${urlPastOrUpcoming}&${urlFilter}=${urlSearchValue}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload, urlPastOrUpcoming, urlFilter, urlSearchValue]);


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
                    placeholder='Search' value={searchValue}  onChange={e => setUrlSearchValue(e.target.value)} />
                
                <select className='form-control mb-2 mr-sm-2' value={filter} onChange={e => setUrlFilter(e.target.value)}>
                    <option value=''>Choose a search filter</option>
                    <option value='topic'>Event Name</option>
                    <option value='v_name'>Volunteer</option>
                    <option value='instructor'>Instructor</option>
                </select>

                <select className='form-control mb-2 mr-sm-2' value={pastOrUpcoming} onChange={e => setUrlPastOrUpcoming(e.target.value)}>
                    <option value='upcoming'>Ongoing/Upcoming events</option>
                    <option value='past'>Past events</option>
                </select>

                <button className='btn btn-primary mb-2'>Search</button>
            </form>

            {/* List or grid toggle */}
            <UIResultsModeToggle
                isDisplayModeGrid={isEventSearchGrided}
                setIsDisplayModeGrid={setIsEventSearchGrided}
                type='events'
                setFeedback={setFeedback}
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
                    />)
                }
            </div>
            
            {/* <PrimaryModalContainer header={targetEvent.topic} runOnModalClose={hideEvent}>
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
            </PrimaryModalContainer> */}
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

