import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function EventForm (props) {
    const [ startDate, setStartDate ] = useState('');
    const [ startTime, setStartTime ] = useState('');
    const [ endDate, setEndDate ] = useState('');
    const [ endTime, setEndTime ] = useState('');
    const [ topic, setTopic ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ cohortsList, setCohortsList ] = useState([]);
    const [ attendees, setAttendees ] = useState('');
    const [ location, setLocation ] = useState('');
    const [ instructor, setInstructor ] = useState('');
    const [ numberOfVolunteers, setNumberOfVolunteers ] = useState('');
    const [ materialsUrl, setMaterialsUrl ] = useState('');

    const getCohortsList = () => {
        axios.get(`/api/cohorts`)
            .then(response => setCohortsList(response.data.payload))
            .catch(err => props.setFeedback(err))
    }
    useEffect(getCohortsList, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (startDate && startTime && endDate && endTime 
                && topic && description && attendees && location 
                && instructor && numberOfVolunteers && materialsUrl) {
                    const timeZone = new Date().getTimezoneOffset() / 60;
                    const start = `${startDate} ${startTime}-${timeZone}`;
                    const end = `${endDate} ${endTime}-${timeZone}`;

                    const event = {
                        start,
                        end,
                        topic,
                        description,
                        attendees,
                        location,
                        instructor,
                        numberOfVolunteers,
                        materialsUrl
                    }

                    const { data } = await axios.post('/api/events/add', event);
                    console.log(data)
                    props.hideEventForm();
                } else {
                    props.setFeedback({message: 'All fields are required'});
                }
        } catch (err) {
            props.setFeedback(err);
        }
    }


    return (
        <>
            <div className='text-right m-2'>
                <button className='btn-sm btn-danger' onClick={props.hideEventForm}>X</button>
            </div>
            <form className='form-row mt-3' onSubmit={handleSubmit}>
                <div className='col-sm-6'>
                    <strong>Start:</strong>
                    <span className='d-flex flex-wrap justify-content-center'>
                        <input 
                            className='form-control mb-2 w-50' 
                            type='date' 
                            placeholder='Start Date' 
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                        <input 
                            className='form-control mb-2 w-50' 
                            type='time' 
                            placeholder='Start time' 
                            value={startTime}
                            onChange={e => setStartTime(e.target.value)}
                        />
                    </span>
                </div>

                <div className='col-sm-6'>
                    <strong>End:</strong>
                    <span className='d-flex flex-wrap justify-content-center'>
                        <input 
                            className='form-control mb-2 w-50' 
                            type='date' 
                            placeholder='End Date' 
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                        />
                        <input 
                            className='form-control mb-2 w-50' 
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
                        {cohortsList.map(cohort => <option key={cohort.cohort_id+cohort.cohort} value={cohort.cohort_id}>{cohort.cohort}</option>)}
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
                    <input 
                        className='form-control mb-2' 
                        type='text' 
                        placeholder='Location / Address' 
                        value={location}
                        onChange={e => setLocation(e.target.value)}
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
                        value={numberOfVolunteers}
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

                        <button className='btn btn-primary'>Submit</button>
                    </span>
                </div>

            </form>
        </>
    )
}