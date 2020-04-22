import React, { useState, useEffect } from 'react';
import axios from 'axios';

import EventCard from './EventCard';
import EventForm from './EventForm';


export default function EventSearch(props) {
    const { setFeedback, loggedUser } = props;

    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [filter, setFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [reload, setReload] = useState(false); 
    const [displayEventForm, setDisplayEventForm] = useState(false);
    // const [targetEventId, setTargetEventId] = useState(0);
    // const [displayTargetEvent, setDisplayTargetEvent] = useState(false);

    const [ formType, setFormType ] = useState('add');
    const [ eventId, setEventId ] = useState(0);
    const [ startDate, setStartDate ] = useState('');
    const [ startTime, setStartTime ] = useState('');
    const [ endDate, setEndDate ] = useState('');
    const [ endTime, setEndTime ] = useState('');
    const [ topic, setTopic ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ attendees, setAttendees ] = useState('');
    const [ location, setLocation ] = useState('');
    const [ instructor, setInstructor ] = useState('');
    const [ numberOfVolunteers, setNumberOfVolunteers ] = useState(''); 
    const [ materialsUrl, setMaterialsUrl ] = useState(''); 
    // const [ eventDuration, setEventDuration ] = useState(0);
    // const [ mustEnterDuration, setMustEnterDuration ] = useState(true);


    const eventInputs = {
        startDate, 
        setStartDate,
        startTime, 
        setStartTime,
        endDate, 
        setEndDate,
        endTime, 
        setEndTime,
        topic, 
        setTopic,
        description, 
        setDescription,
        attendees, 
        setAttendees,
        location, 
        setLocation,
        instructor, 
        setInstructor,
        numberOfVolunteers, 
        setNumberOfVolunteers,
        materialsUrl, 
        setMaterialsUrl,
        // eventDuration,
        // setEventDuration,
        // mustEnterDuration
    }



    useEffect(() => {
        const getAllEvents = async () => {
            try {
                if (props.loggedUser && props.loggedUser.a_id) {
                    const { data } = await axios.get(`/api/events/admin/all/?${filter}=${search}&${dateFilter}=${dateFilter}`);
                    setResults(data.payload);
                }
                else {
                    const { data } = await axios.get(`/api/events/admin/all/?${filter}=${search}&${dateFilter}=${dateFilter}`);
                    // const { data } = await axios.get(`/api/events/all/?${filter}=${search}&${dateFilter}=${dateFilter}`);
                    setResults(data.payload);
                }

            } catch (err) {
                setFeedback(err)
            }
        }

        getAllEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setFeedback, reload]);

    // useEffect(() => {
    //     if (startDate === endDate) {
    //         setMustEnterDuration(false);
    //     } else {
    //         setMustEnterDuration(true);
    //     }
    // }, [startDate, endDate])

    const handleSearch = (e) => {
        e.preventDefault();
        setReload(!reload);
    }

    const handleDeleteEvent = async (id) => {
        try {
            await axios.delete(`/api/events/${id}`)
            setReload(!reload);
        } catch (err) {
            setFeedback(err);
        }
    }

    const clearInputs = () => {
        setFormType('add');
        setEventId(0);
        setStartDate('');
        setStartTime('');
        setEndDate('');
        setEndTime('');
        setTopic('');
        setDescription('');
        setAttendees('');
        setLocation('');
        setInstructor('');
        setNumberOfVolunteers('');
        setMaterialsUrl('');
        // setEventDuration(0);
    }

    const hideEventForm = () => {
        clearInputs();
        setDisplayEventForm(false);
        // setReload(!reload);
    }

    const preFillEvent = (event) => {
        const formatDate = (strDate) => {
            const date = new Date(strDate);
            const y = date.getFullYear();
            let m = date.getMonth() + 1 + '';
            if (m.length === 1) {
                m = '0' + m;
            }
            let d = date.getDate() + '';
            if (d.length === 1) {
                d = '0' + d;
            }
            return `${y}-${m}-${d}`;
        }

        const formatTime = (date) => {
            const t = new Date(date).toLocaleTimeString();
            const amOrPm = t.split(' ')[1];
            let h = t.split(':')[0];
            const m = t.split(':')[1];
            if (amOrPm === 'pm' || amOrPm === 'Pm' || amOrPm === 'PM') {
                h = parseInt(h) + 12;
            }
            return `${h}:${m}`
        }

        setFormType('edit');
        setEventId(event.event_id);
        setStartDate(event.event_start)
        setStartDate(formatDate(event.event_start));
        setStartTime(formatTime(event.event_start));
        setEndDate(formatDate(event.event_end));
        setEndTime(formatTime(event.event_end));
        setTopic(event.topic);
        setDescription(event.description);
        setAttendees(event.cohort_id + '');
        setLocation(event.location);
        setInstructor(event.instructor);
        setNumberOfVolunteers(event.volunteers_needed)
        setMaterialsUrl(event.materials_url);
        // setEventDuration(event.event_duration);
    }

    const handleEditButton = (event) => {
        preFillEvent(event);
        setDisplayEventForm(true);
    }

    const calcHours = (date1, date2) => { // Function to validate the event's date
        const now = new Date().getTime();
        const d1 = new Date(date1).getTime();
        const d2 = new Date(date2).getTime();
        const time = d2 - d1;
        if (time <= 0) {
            throw new Error('End date must be later then the start date');
        }
        if ((formType ==='add' && d1 < now) || (formType === 'edit' && d2 < now)) {
            throw new Error('Events cannot be created / edited for past times ');
        }
        return Math.ceil(time / 3600000);
    }

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        try {
            if (startDate && endDate && topic && description && attendees 
                && location && instructor && numberOfVolunteers) {
                    const timeZone = new Date().getTimezoneOffset() / 60;
                    
                    const start = `${startDate} ${startTime || '00:00'}-${timeZone}`;
                    const end = `${endDate} ${endTime || '23:59'}-${timeZone}`;

                    calcHours(start, end);
                    // let evDuration = eventDuration;
                    // if (mustEnterDuration && !eventDuration) {
                    //     throw new Error('Please enter an estimated duration for the event');
                    // } else {
                    //     const duration = calcHours(start, end);
                    //     setEventDuration(duration);
                    //     evDuration = duration;
                    // }

                    const event = {
                        start,
                        end,
                        topic,
                        description,
                        attendees,
                        location,
                        instructor,
                        numberOfVolunteers,
                        materialsUrl,
                        // eventDuration: evDuration
                    }
                    
                    if (formType === 'edit') {
                        await axios.put(`/api/events/edit/${eventId}`, event);
                    } else {
                        await axios.post('/api/events/add', event);
                    }
                    hideEventForm();
                    setReload(!reload);


                } else {
                    props.setFeedback({message: 'All fields are required'});
                }
        } catch (err) {
            props.setFeedback(err);
        }
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
                        ? <EventForm
                            setFeedback={setFeedback} 
                            hideEventForm={hideEventForm} 
                            {...eventInputs} 
                            handleSubmitForm={handleSubmitForm}/>
                        : null
                    }
                </>
                : null
            }

            <hr />

            <h3>Events: </h3>
            <form className='form-inline' onSubmit={handleSearch}>
                <input className='form-control mb-2 mr-sm-2 min-w-25' type='text' 
                    placeholder='Search' value={search}  onChange={e => setSearch(e.target.value)} />
                
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

                <button className='btn btn-primary mb-2'>Search</button>
            </form>
            
            <div className='row m-1'>
                {results.map(event => <EventCard 
                                key={event.event_id}
                                loggedUser={loggedUser} 
                                event={event} 
                                delete={handleDeleteEvent} 
                                edit={handleEditButton}
                                setFeedback={setFeedback}
                            />
                )}
            </div>

        </div>
    );
}

