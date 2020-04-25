import React, { useState, useEffect } from 'react';
import axios from 'axios';

import VolunteerCard from './VolunteersCard';
import ProfileRender from './ProfilePages/ProfileRender';

export default function VolunteerSearch(props) {
    const { setFeedback } = props;
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [filter, setFilter] = useState('');
    const [targetVolunteerId, setTargetVolunteerId] = useState(0);
    const [displayTargetUser, setDisplayTargetUser] = useState(false);
    const [reload, setReload] = useState(0);

    useEffect(() => {
        const getAllVolunteers = async () => {
            try {
                if (filter === '') {
                    const { data } = await axios.get(`/api/volunteers/all/`);
                    setResults(data.payload);
                } else if (filter === 'v_email') {
                    const { data } = await axios.get(`/api/volunteers/all/?v_email=${search}`);
                    setResults(data.payload);
                } else if (filter === 'company') {
                    const { data } = await axios.get(`/api/volunteers/all/?company=${search}`);
                    setResults(data.payload);
                }
                else if (filter === 'skill') {
                    const { data } = await axios.get(`/api/volunteers/all/?skill=${search}`);
                    setResults(data.payload);
                } else {
                    const { data } = await axios.get(`/api/volunteers/all/?name=${search}`);
                    setResults(data.payload);
                }
            } catch (err) {
                setFeedback(err);
            }
        }
        getAllVolunteers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setFeedback, reload]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setReload(reload + 1);
    }

    const makeTargetVolunteerId = (id) => {
        setTargetVolunteerId(id)
    }

    const displayProfile = () => {
        setDisplayTargetUser(true)
    }

    const hideProfile = () => {
        setDisplayTargetUser(false)
    }

    return (
        <div className="Search">
            <form className='form-inline' onSubmit={handleSubmit}>
                <input className='form-control mb-2 mr-sm-2 min-w-25' type='text' 
                    placeholder='Search' value={search} onChange={e => { setSearch(e.target.value) }} />

                <select className='form-control mb-2 mr-sm-2' value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value=''>Choose a search filter</option>
                    <option value='name'>Name</option>
                    <option value='v_email'>Email</option>
                    <option value='company'>Company</option>
                    <option value='skill'>Skill</option>
                </select>

                <button className='btn btn-primary mb-2'>Search</button>
            </form>

            <div className='row m-1'>
                {results.map(volunteer => <VolunteerCard
                        key={volunteer.v_id + volunteer.v_first_name + volunteer.v_last_name}
                        volunteer={volunteer}
                        displayProfile={displayProfile}
                        setTargetVolunteerId={makeTargetVolunteerId}
                        setFeedback={setFeedback}
                    />
                )}
            </div>

            {
                displayTargetUser
                    ? <ProfileRender
                        volunteerId={targetVolunteerId}
                        hideProfile={hideProfile}
                        setFeedback={props.setFeedback}
                        loggedUser={props.loggedUser}
                    />
                    : null
            }
        </div>
    );
}

