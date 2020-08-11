import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function FellowCohortInput (props) {
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
            <label htmlFor="cohortSel" className="g1TxtLabel mt-auto">Cohort</label>
            <select
                className='form-control'
                id='cohortSel'
                onChange={e => props.setCohortId(e.target.value)}
                value={props.cohortId}
            >
                <option value={0}>-- Select your cohort --</option>
                {cohortsList
                    .filter(cohortObj => !isNaN(parseInt(cohortObj.cohort)))
                    .map(cohortObj => {
                        return (
                            <option
                                key={cohortObj.cohort_id + cohortObj.cohort}
                                value={cohortObj.cohort_id}
                            >
                                {cohortObj.cohort}
                            </option>
                        )
                    })
                }
            </select>
        </>
    )
}
