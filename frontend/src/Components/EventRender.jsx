import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

import EventCard from './EventCard';
import Spinner from './Spinner';

export default function EventRender(props) {
    const { eventId } = useParams();
    const history = useHistory();

    const { loggedUser, setFeedback } = props;
    
    const [ singleEvent, setSingleEvent ] = useState({ volunteers_list: []});
    const [ eventObj, setEventObj ] = useState({ volunteersList: [], acceptedVolunteers: []});

    const [ volunteersList, setVolunteersList ] = useState([]);
    const [ loggedVolunteerPartOfEvent, setLoggedVolunteerPartOfEvent ] = useState(false);
    const [ loggedVolunteerRequestAccepted, setLoggedVolunteerRequestAccepted ] = useState(false);
    const [ acceptedVolunteers, setAcceptedVolunteers] = useState([]);
    const [ reload, SetReload ] = useState(false);
    const [ loading, setLoading ] = useState(true);


    const getEvent = (id, isMounted) => {
        axios.get(`/api/events/event/${id}`)
            .then(response => {
                if (isMounted) {
                    setSingleEvent(response.data.payload);
                    setLoading(false);
                }
            })
            .catch (err => {
                if (isMounted && err.response && err.response.status === 404) {
                    history.push('/404');
                } else if (isMounted) {
                    setFeedback(err)
                }
            });
    }
    useEffect(() => {
        let isMounted = true;
        if (!isNaN(parseInt(eventId)) && parseInt(eventId).toString().length === eventId.length) {
            getEvent(eventId, isMounted);
        } else {
            history.push('/404');
        }

        // Cleanup
        return () => isMounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId, reload]);
    

    const mapVolunteersList = () => {
        let found = false;
        let accepted = false;
        const accVolunteers = [];
        const volList = [];

        if (singleEvent.volunteers_list && singleEvent.volunteers_list[0]) {
            for (let volunteer of singleEvent.volunteers_list) {
                const volunteerInfo = volunteer.split(' &$%& ');
                /* 
                    index0: volunteer ID
                    index1: first and last name
                    index2: email
                    index3: volunteer profile deleted
                    index4: event_volunteers table id
                    index5: volunteer confirmed to event
                */
                if (loggedUser && loggedUser.v_id && loggedUser.v_id === parseInt(volunteerInfo[0])) { 
                    found = true;
                    if (volunteerInfo[5] === 'true') {
                        accepted = true
                    }
                }
                if (volunteerInfo[5] === 'true') {
                    accVolunteers.push(parseInt(volunteerInfo[0]));
                }
                volList.push(volunteerInfo);
            }
        }
        volList.sort((a, b) => a[0]-b[0]);

        setLoggedVolunteerPartOfEvent(found);
        setLoggedVolunteerRequestAccepted(accepted);
        setAcceptedVolunteers(accVolunteers);
        setVolunteersList(volList);
    }
    useEffect(mapVolunteersList, [loggedUser, singleEvent]);


    useEffect(() => {
        const eventDataObj = Object.assign({}, singleEvent, {
            volunteersList,
            loggedVolunteerPartOfEvent,
            loggedVolunteerRequestAccepted,
            acceptedVolunteers
        });
        setEventObj(eventDataObj);
    }, [
        acceptedVolunteers,
        singleEvent,
        loggedVolunteerPartOfEvent,
        loggedVolunteerRequestAccepted,
        volunteersList
    ]);

     if (loading) {
        return <Spinner/>
    }

    return (
        <div className='container'>
            <div className='modal-header'>
                <h4 className='font-weight-bold'>{eventObj.topic}</h4>
            </div>
            
            <EventCard 
                loggedUser={loggedUser} 
                event={eventObj}
                setFeedback={setFeedback}
                reloadParent={reload}
                setReloadParent={SetReload}
                parent='EventRender'
            />
        </div>
    )
}
