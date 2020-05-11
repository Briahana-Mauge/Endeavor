import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import EventCard from './EventCard';

export default function ProfileRender(props) {
    const { eventId } = useParams();
    const { loggedUser, event, setFeedback } = props;
            // reloadParent
            // setReloadParent
            // hideEvent
    
    const [ pageForm, setPageForm ] = useState('');
    const [ singleEvent, setSingleEvent ] = useState({ volunteers_list: []});
    const [ eventObj, setEventObj ] = useState({ volunteersList: []});

    const [ volunteersList, setVolunteersList ] = useState([]);
    const [ loggedVolunteerPartOfEvent, setLoggedVolunteerPartOfEvent ] = useState(false);
    const [ loggedVolunteerRequestAccepted, setLoggedVolunteerRequestAccepted ] = useState(false);
    const [ acceptedVolunteers, setAcceptedVolunteers] = useState([]);
    const [ reload, SetReload ] = useState(false);

    const getEvent = async(id) => {
        try {
            const { data } = await axios.get(`/api/events/event/${id}`);
            setSingleEvent(data.payload);
        } catch (err) {
            setFeedback(err);
        }
    }
    useEffect(() => {
        if (eventId && !event) {
            setPageForm('container');
            getEvent(eventId);
        } else if (event) {
            setPageForm('lightBox');
            setSingleEvent(event)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId, event, reload]);
    

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
        event,
        loggedVolunteerPartOfEvent,
        loggedVolunteerRequestAccepted,
        volunteersList
    ]);

    if (!pageForm) return null;

    return (
        <div className={pageForm}>
            {
                pageForm === 'lightBox'
                ?   <div className='text-right m-2 closeButton'>
                        <button className='btn-sm btn-danger' onClick={props.hideEvent}>X</button>
                    </div>
                : null
            }

            <EventCard 
                loggedUser={loggedUser} 
                event={eventObj}
                setFeedback={setFeedback}
                reloadParent={props.setReloadParent ? props.reloadParent : reload}
                setReloadParent={props.setReloadParent ? props.setReloadParent : SetReload}
            />
        </div>
    )
}
