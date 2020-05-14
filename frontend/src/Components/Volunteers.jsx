import React, { useState, useEffect } from 'react';
import axios from 'axios';

import VolunteerCard from './VolunteerCard';
import { PrimaryModalContainer } from './Modals/PrimaryModal';
import ProfileRender from './ProfilePages/ProfileRender';

export default function Volunteers (props) {
    const { setFeedback } = props;
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [skillsList, setSkillsList] = useState([]);
    const [filter, setFilter] = useState('');
    const [targetSkill, setTargetSkill] = useState('');
    const [targetVolunteerId, setTargetVolunteerId] = useState(null);
    const [targetVolunteerName, setTargetVolunteerName] = useState('');
    const [displayTargetUser, setDisplayTargetUser] = useState(false);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const getSkillsList = async () => {
            try {
                const { data } = await axios.get('/api/skills');
                setSkillsList(data.payload);
            } catch (err) {
                setFeedback(err)
            }
        }
        getSkillsList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const getAllVolunteers = async () => {
            try {
                const { data } = await axios.get(`/api/volunteers/all/?${filter}=${search}&skill=${targetSkill}`);
                setResults(data.payload);
            } catch (err) {
                setFeedback(err);
            }
        }
        getAllVolunteers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload, filter, targetSkill]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setReload(!reload);
    }

    const hideVolunteer = () => {
        setDisplayTargetUser(false);
        setTargetVolunteerId(null);
        setTargetVolunteerName('');
    }


    return (
        <>
        <div className="Search">
            <form className='form-inline' onSubmit={handleSubmit}>
                <input className='form-control mb-2 mr-sm-2 min-w-25' type='text' 
                    placeholder='Search' value={search} onChange={e => { setSearch(e.target.value) }} />

                <select className='form-control mb-2 mr-sm-2' value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value=''>Choose a search filter</option>
                    <option value='name'>Name</option>
                    <option value='v_email'>Email</option>
                    <option value='company'>Company</option>
                </select>

                <select className='form-control mb-2 mr-sm-2' value={targetSkill} onChange={e => setTargetSkill(e.target.value)}>
                    <option value=''>-- Skill --</option>
                    { skillsList.map(skill => <option key={skill.skill + skill.skill_id} value={skill.skill}>{skill.skill}</option>) }
                </select>

                <button className='btn btn-primary mb-2'>Search</button>
            </form>

            <div className='row m-1'>
                {results.map(volunteer => <VolunteerCard
                        key={volunteer.v_id + volunteer.v_first_name + volunteer.v_last_name}
                        volunteer={volunteer}
                        setDisplayTargetUser={setDisplayTargetUser}
                        setTargetVolunteerId={setTargetVolunteerId}
                        setTargetVolunteerName={setTargetVolunteerName}
                    />
                )}
            </div>
        </div>

            <PrimaryModalContainer header={targetVolunteerName || ''} hideModal={hideVolunteer}>
                {
                    displayTargetUser
                        ? <ProfileRender
                            volunteerId={targetVolunteerId}
                            setDisplayTargetUser={setDisplayTargetUser}
                            setFeedback={props.setFeedback}
                            loggedUser={props.loggedUser}
                        />
                        : null
                }
            </PrimaryModalContainer>
        </>
    );
}

