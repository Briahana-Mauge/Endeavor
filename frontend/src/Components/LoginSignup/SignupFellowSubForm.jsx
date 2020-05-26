import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SignupFellowSubForm(props) {
    const { setFeedback } = props;

    const [ cohortsList, setCohortsList ] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const getCohortsList = () => {
            axios.get(`api/cohorts`)
            .then(response => {
                if (isMounted) {
                    setCohortsList(response.data.payload)
                }
            })
            .catch(err => {
                if (isMounted) {
                    setFeedback(err)
                }
            });
        }
        getCohortsList();

        //Cleanup
        return () => isMounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            <div className='col-sm-6'>
                <select className='form-control' onChange={e => props.setCohortId(e.target.value)} value={props.cohortId}>
                    <option value={0}> -- Cohort --</option>
                    {cohortsList.map(cohort => <option key={cohort.cohort_id+cohort.cohort} value={cohort.cohort_id}>{cohort.cohort}</option>)}
                </select>
            </div>
        </>
    )
}