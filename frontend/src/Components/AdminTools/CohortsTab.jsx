import React, { useState, useEffect } from 'react';
import axios from 'axios';


export default function Cohorts(props) {
    const { setFeedback } = props;

    const [ cohortsList, setCohortsList ] = useState([]);
    const [ cohortName, setCohortName ] = useState('');
    const [ tracker, setTracker ] = useState({});
    const [ reload, setReload ] = useState(0);

    useEffect(() => {
        const getCohortsList = async () => {
            axios.get('/api/cohorts')
            .then(res => {
                setCohortsList(res.data.payload);
                const map = {};
                for (let elem of res.data.payload) {
                    map[elem.cohort_id] = elem.cohort;
                }
                setTracker(map);
            })
            .catch(err => setFeedback(err));
        }

        getCohortsList();
    }, [setFeedback, reload]);

    const deleteCohort = async (cohortId) => {
        try {
            const { data } = await axios.delete(`/api/cohorts/del/${cohortId}`);
            // getCohortsList();
            setReload(reload + 1);
            setFeedback(data);
        } catch (err) {
            setFeedback(err);
        }
    }

    const handleInputEdit = (e, key) => {
        const map = {...tracker};
        map[key] = e.target.value;
        setTracker(map);
    }

    const editCohort = async (cohortId, text) => {
        try {
            if (text) {
                const { data } = await axios.put(`/api/cohorts/edit/${cohortId}`, {cohort: text});
                // getCohortsList();
                setReload(reload + 1);
                setFeedback(data);
            } else {
                setFeedback({message: 'Please enter a cohort'});
            }
        } catch (err) {
            setFeedback(err);
        }
    }

    const addCohort = async () => {
        try {
            if (cohortName) {
                const { data } = await axios.post(`/api/cohorts/add`, {cohort: cohortName});
                // getCohortsList();
                setReload(reload + 1);
                setFeedback(data);
            } else {
                setFeedback({message: 'Please enter a cohort'});
            }
        } catch (err) {
            setFeedback(err);
        }
    }

    return (
        <div className='mt-4'>
            <input 
                type='text' 
                className='inputFormText mb-2 mr-sm-2' 
                placeholder='Enter cohort'
                value={cohortName}
                onChange={e => setCohortName(e.target.value)}
            />
            <button className='btn btn-info mx-2 my-1' onClick={addCohort}>Add</button>
            

            {
                cohortsList.map(cohort => <div className='d-flex justify-content-between' key={cohort.cohort_id + cohort.cohort}>
                    <input 
                        type='text' 
                        className='inputFormText mb-2 mr-sm-2 flex-grow-1' 
                        placeholder='Enter cohort'
                        value={tracker[cohort.cohort_id] || ''}
                        onChange={e => handleInputEdit(e, cohort.cohort_id)}
                    />
                    <div className=''>
                        <button className='btn btn-info mx-2 my-1' onClick={e => editCohort(cohort.cohort_id, tracker[cohort.cohort_id])}>Save</button>
                        <button className='btn btn-danger mx-2 my-1' onClick={e => deleteCohort(cohort.cohort_id)}>Delete</button>
                    </div>
                </div>)
            }
        </div>
    )
}
