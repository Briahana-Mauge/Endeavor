import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function EventForm (props) {
    const [ cohortsList, setCohortsList ] = useState([]);

    const getCohortsList = () => {
        axios.get(`/api/cohorts`)
            .then(response => setCohortsList(response.data.payload))
            .catch(err => props.setFeedback(err))
    }
    useEffect(getCohortsList, []);


    return (
        <>
            <div className='text-right m-2'>
                <button className='btn-sm btn-danger' onClick={props.hideEventForm}>X</button>
            </div>
            <form className='form-row mt-3' onSubmit={props.handleAddEvent}>
                <div className='col-sm-6'>
                    <strong>Start:</strong>
                    <span className='d-flex flex-wrap justify-content-center'>
                        <input 
                            className='form-control mb-2 w-50' 
                            type='date' 
                            placeholder='Start Date' 
                            value={props.startDate}
                            onChange={e => props.setStartDate(e.target.value)}
                        />
                        <input 
                            className='form-control mb-2 w-50' 
                            type='time' 
                            placeholder='Start time' 
                            value={props.startTime}
                            onChange={e => props.setStartTime(e.target.value)}
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
                            value={props.endDate}
                            onChange={e => props.setEndDate(e.target.value)}
                        />
                        <input 
                            className='form-control mb-2 w-50' 
                            type='time' 
                            placeholder='End time' 
                            value={props.endTime}
                            onChange={e => props.setEndTime(e.target.value)}
                        />
                    </span>
                </div>

                <div className='col-sm-6'>
                    <input 
                        className='form-control mb-2' 
                        type='text' 
                        placeholder='Title / Topic' 
                        value={props.topic}
                        onChange={e => props.setTopic(e.target.value)}
                    />
                </div>

                <div className='col-sm-6'>
                    <select className='form-control mb-2' onChange={e => props.setAttendees(e.target.value)} value={props.attendees}>
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
                        value={props.description}
                        onChange={e => props.setDescription(e.target.value)}
                    />
                </div>

                <div className='col-sm-12'>
                    <input 
                        className='form-control mb-2' 
                        type='text' 
                        placeholder='Location / Address' 
                        value={props.location}
                        onChange={e => props.setLocation(e.target.value)}
                    />
                </div>

                <div className='col-sm-6'>
                    <input 
                        className='form-control mb-2' 
                        type='text' 
                        placeholder='Instructor / Host' 
                        value={props.instructor}
                        onChange={e => props.setInstructor(e.target.value)}
                    />
                </div>

                <div className='col-sm-6'>
                    <input 
                        className='form-control mb-2' 
                        type='number' 
                        placeholder='Number of needed volunteers' 
                        value={props.numberOfVolunteers}
                        onChange={e => props.setNumberOfVolunteers(e.target.value)}
                    />
                </div>

                <div className='col-sm-12'>
                    <span className='d-flex flex-wrap justify-content-between'>
                        <input 
                            className='form-control mb-2 w-75' 
                            type='url' 
                            placeholder='Materials Link' 
                            value={props.materialsUrl}
                            onChange={e => props.setMaterialsUrl(e.target.value)}
                        />

                        <button className='btn btn-primary'>Submit</button>
                    </span>
                </div>

            </form>
        </>
    )
}