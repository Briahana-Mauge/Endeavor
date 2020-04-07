import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SignupFellowSubForm(props) {
    const [ classes, setClasses ] = useState([{class_id: 1, class:'general'}]);

    const getClassesList = async () => {
        try {
            const { data } = await axios.get(`api/classes`);
            setClasses(data.payload);
        } catch (err) {
            props.setFeedback(err)
        }
    }
    useEffect(() => {
        getClassesList();
    }, [])

    return (
        <>
            <div className='col-sm-6'>
                <select className='mb-2' onChange={e => props.setCohortId(e.target.value)} value={props.cohortId}>
                    <option value={0}> -- Cohort --</option>
                    {classes.map(cohort => <option key={cohort.class_id+cohort.class} value={cohort.class_id}>{cohort.class}</option>)}
                </select>
            </div>
        </>
    )
}