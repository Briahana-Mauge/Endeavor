import React, { useState, useEffect } from 'react';
import axios from 'axios';

import FellowPreviewCard from './FellowPreviewCard';


export default function Volunteers (props) {
    const { setFeedback, volunteer } = props;
    
    const [ search, setSearch ] = useState('');
    const [ fellowsList, setFellowsList ] = useState([]);
    const [ cohortsList, setCohortsList ] = useState([]);
    const [ targetCohort, setTargetCohort ] = useState('');
    const [ requestedMentor, setRequestedMentor ] = useState('');
    const [ reload, setReload ] = useState(false);

    useEffect(() => {
        let isMounted = true;
        axios.get('/api/cohorts')
            .then(response => {
                if (isMounted) {
                    setCohortsList(response.data.payload);
                }
            })
            .catch(err => {
                if (isMounted) {
                    setFeedback(err)
                }
            });
        
        
        // Cleanup
        return () => isMounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let isMounted = true;
        axios.get(`/api/fellows?name=${search}&cohort=${targetCohort}&mentor=${requestedMentor}`)
            .then(response => {
                if (isMounted) {
                    setFellowsList(response.data.payload);
                }
            })
            .catch (err => {
                if (isMounted) {
                    setFeedback(err);
                }
            })

        // Cleanup
        return () => isMounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload, targetCohort, requestedMentor, search]);


    const handleSubmit = async (event) => {
        event.preventDefault();
        setReload(!reload);
    }

    const pairFellow = async (fellowId) => {
        try {
            const requestBody = {
                fellowId,
                volunteerId: volunteer.v_id
            }
            await axios.post('/api/mentor_pairs', requestBody);
            setReload(!reload);
            props.setReload(!props.reload);
        } catch (err) {
            setFeedback(err)
        }
    }


    return (
        <>
            <form className='form-inline' onSubmit={handleSubmit}>
                <input className='form-control mb-2 mr-sm-2 min-w-25' type='text' 
                    placeholder='Fellow name' value={search} onChange={e => { setSearch(e.target.value) }} />

                <select className='form-control mb-2 mr-sm-2' value={targetCohort} onChange={e => setTargetCohort(e.target.value)}>
                    <option value=''>-- Cohorts --</option>
                    { cohortsList.map(cohort => <option key={cohort.cohort + cohort.cohort_id} value={cohort.cohort_id}>{cohort.cohort}</option>) }
                </select>

                <select className='form-control mb-2 mr-sm-2' value={requestedMentor} onChange={e => setRequestedMentor(e.target.value)}>
                    <option value=''>-- Requested a Mentor --</option>
                    <option value='true'> Yes </option>
                    <option value='false'> No </option>
                </select>

                <button className='btn btn-primary mb-2'>Search</button>
                <span className='btn btn-danger mb-2 float-right ml-auto' onClick={e => props.setShowFellowsList(false)} >Close</span> 
            </form>

            <div className='row m-1'>
                {fellowsList.map(fellow => 
                    <div className='col col-sm-6 col-lg-4 col-xl-3' 
                        key={fellow.f_id + fellow.f_first_name + fellow.f_last_name}>
                        <FellowPreviewCard
                            fellow={fellow}
                            pairFellow={pairFellow}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

