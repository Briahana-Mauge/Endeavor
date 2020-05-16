import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

export default function EventForm (props) {
    const { setFeedback } = props;
    const history = useHistory();

    const formType = useLocation().pathname.split('/')[2];
    const { eventId } = useParams();

    const [ startDate, setStartDate ] = useState('');
    const [ startTime, setStartTime ] = useState('');
    const [ endDate, setEndDate ] = useState('');
    const [ endTime, setEndTime ] = useState('');
    const [ topic, setTopic ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ staffDescription, setStaffDescription ] = useState('');
    const [ attendees, setAttendees ] = useState('');
    const [ eventLocation, setEventLocation ] = useState('');
    const [ instructor, setInstructor ] = useState('');
    const [ numberOfVolunteers, setNumberOfVolunteers ] = useState(''); 
    const [ materialsUrl, setMaterialsUrl ] = useState(''); 
    const [ important, setImportant ] = useState(false);
    const [ cohortsList, setCohortsList ] = useState([]);


    const getCohortsList = () => {
        axios.get(`/api/cohorts`)
            .then(response => setCohortsList(response.data.payload))
            .catch(err => setFeedback(err))
    }
    useEffect(getCohortsList, []);

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
            if (t === '12:00:00 AM' || t === '11:59:00 PM') {
                return ''
            }
            const amOrPm = t.split(' ')[1];
            let h = t.split(':')[0];
            const m = t.split(':')[1];
            if (amOrPm === 'pm' || amOrPm === 'Pm' || amOrPm === 'PM') {
                h = parseInt(h) + 12;
            } else if (h === '12') {
                h = '00';
            }
            return `${h}:${m}`
        }
console.log(event)
        setStartDate(formatDate(event.event_start));
        setStartTime(formatTime(event.event_start));
        setEndDate(formatDate(event.event_end));
        setEndTime(formatTime(event.event_end));
        setTopic(event.topic);
        setDescription(event.description);
        setStaffDescription(event.staff_description);
        setAttendees(event.cohort_id + '');
        setEventLocation(event.location);
        setInstructor(event.instructor);
        setNumberOfVolunteers(event.number_of_volunteers);
        setMaterialsUrl(event.materials_url);
        setImportant(event.important);
    }

    useEffect(() => {
        const getEvent = async (id) => {
            try {
                const { data } = await axios.get(`/api/events/event/${id}`);
                preFillEvent(data.payload)
            } catch (err) {
                setFeedback(err)
            }
        }
        if (eventId) {
            getEvent(eventId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formType, eventId]);


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
                && eventLocation && instructor && numberOfVolunteers) {
                    const timeZone = new Date().getTimezoneOffset() / 60;
                    
                    const start = `${startDate} ${startTime || '00:00'}-${timeZone}`;
                    const end = `${endDate} ${endTime || '23:59'}-${timeZone}`;

                    calcHours(start, end); // Validation of the dates/times inputs

                    const event = {
                        start,
                        end,
                        topic,
                        description,
                        staffDescription,
                        attendees,
                        location: eventLocation,
                        instructor,
                        numberOfVolunteers,
                        materialsUrl,
                        important
                    }
                    
                    if (formType === 'edit') {
                        await axios.put(`/api/events/edit/${eventId}`, event);
                    } else {
                        await axios.post('/api/events/add', event);
                    }
                    history.push('/events/home');


                } else {
                    setFeedback({message: 'All fields are required'});
                }
        } catch (err) {
            setFeedback(err);
        }
    }

    return (
            <form className='form-row m-3' onSubmit={handleSubmitForm}>
                <div className='col-sm-6'>
                    <strong>Start:</strong>
                    <span className='d-flex flex-wrap justify-content-center'>
                        <input 
                            className='form-control mb-2 min-w-50' 
                            type='date' 
                            placeholder='Start Date' 
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                        <input 
                            className='form-control mb-2 min-w-50' 
                            type='time' 
                            placeholder='Start time' 
                            value={startTime}
                            onChange={e => setStartTime(e.target.value)}
                        />
                    </span>
                </div>

                <div className='col-sm-6 mb-3'>
                    <strong>End:</strong>
                    <span className='d-flex flex-wrap justify-content-center'>
                        <input 
                            className='form-control mb-2 min-w-50' 
                            type='date' 
                            placeholder='End Date' 
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                        />
                        <input 
                            className='form-control mb-2 min-w-50' 
                            type='time' 
                            placeholder='End time' 
                            value={endTime}
                            onChange={e => setEndTime(e.target.value)}
                        />
                    </span>
                </div>

                <div className='col-sm-6'>
                    <input 
                        className='form-control mb-2' 
                        type='text' 
                        placeholder='Title / Topic' 
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                    />
                </div>

                <div className='col-sm-6'>
                    <select className='form-control mb-2' onChange={e => setAttendees(e.target.value)} value={attendees}>
                        <option value=''> -- Cohort --</option>
                        {cohortsList.map(cohort => 
                            <option 
                                key={cohort.cohort_id+cohort.cohort} 
                                value={cohort.cohort_id}>
                                    {cohort.cohort}
                            </option>)}
                    </select>
                </div>

                <div className='col-sm-12'>
                    <textarea 
                        className='form-control mb-2' 
                        placeholder='Description' 
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>

                <div className='col-sm-12'>
                    <textarea 
                        className='form-control mb-2' 
                        placeholder='Staff escription' 
                        value={staffDescription || ''}
                        onChange={e => setStaffDescription(e.target.value)}
                    />
                </div>

                <div className='col-sm-12'>
                    <input 
                        className='form-control mb-2' 
                        type='text' 
                        placeholder='Location / Address' 
                        value={eventLocation}
                        onChange={e => setEventLocation(e.target.value)}
                    />
                </div>

                <div className='col-sm-6'>
                    <input 
                        className='form-control mb-2' 
                        type='text' 
                        placeholder='Instructor / Host' 
                        value={instructor}
                        onChange={e => setInstructor(e.target.value)}
                    />
                </div>

                <div className='col-sm-6'>
                    <input 
                        className='form-control mb-2' 
                        type='number' 
                        placeholder='Number of needed volunteers' 
                        value={numberOfVolunteers || ''}
                        onChange={e => setNumberOfVolunteers(e.target.value)}
                    />
                </div>

                <div className='col-sm-12'>
                    <span className='d-flex flex-wrap justify-content-between'>
                        <input 
                            className='form-control mb-2 w-75' 
                            type='url' 
                            placeholder='Materials Link' 
                            value={materialsUrl}
                            onChange={e => setMaterialsUrl(e.target.value)}
                        />

                        <div className='custom-control custom-switch mt-2'>
                            <input 
                                type='checkbox' className='custom-control-input' id='publicProfile'
                                checked={important || false} onChange={e => setImportant(e.target.checked)}
                            />
                            <label className='custom-control-label' htmlFor='publicProfile'>Important?</label>
                        </div>

                        <button className='btn btn-primary'>Submit</button>
                    </span>
                </div>
            </form>
    )
}