import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SignupFellowSubForm(props) {
    const [ cohorts, setCohorts ] = useState([{cohort_id: 1, cohort:'General'}]);

    const getCohortsList = async () => {
        try {
            const { data } = await axios.get(`api/cohorts`);
            setCohorts(data.payload);
        } catch (err) {
            props.setNetworkError(err)
        }
    }
    useEffect(() => {
        getCohortsList();
    }, [])

    return (
        <>
            <div className='col-sm-6'>
                <select className='mb-2' onChange={e => props.setCohortId(e.target.value)} value={props.cohortId}>
                    <option value={0}> -- Cohort --</option>
                    {cohorts.map(cohort => <option key={cohort.cohort_id + cohort.cohort} value={cohort.cohort_id}>{cohort.cohort}</option>)}
                </select>
            </div>
        </>
    )
}