import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import axios from 'axios';

import VolunteerCard from './VolunteerCard';
import { PrimaryModalContainer } from './Modals/PrimaryModal';
import ProfileRender from './ProfilePages/ProfileRender';

export default function Volunteers (props) {
    const { search } = useLocation();
    const history = useHistory();
    const { setFeedback } = props;

    const getQueryStrings = () => {
        const values = queryString.parse(search);
        const skill = values.skill;
        delete values.skill;
        const valueKey = Object.keys(values);
        const valueValue = Object.values(values);

        return [valueKey, valueValue, skill];
    }

    const [searchValue, setSearchValue] = useState('');
    const [filter, setFilter] = useState('');
    const [targetSkill, setTargetSkill] = useState('');
    
    const [strQueryFilter, strQuerySearchValue, strQueryTargetSkill] = getQueryStrings();
    const [urlSearchValue, setUrlSearchValue] = useState(strQuerySearchValue || '');
    const [urlFilter, setUrlFilter] = useState(strQueryFilter || '');
    const [urlTargetSkill, setUrlTargetSkill] = useState(strQueryTargetSkill || '');
    
    const [results, setResults] = useState([]);
    const [isDisplayModeGrid, setIsDisplayModeGrid] = useState(false);
    const [skillsList, setSkillsList] = useState([]);
    const [targetVolunteerId, setTargetVolunteerId] = useState(null);
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
        const [valueKey, valueValue, skill] = getQueryStrings();

        setSearchValue(valueValue || '');
        setFilter(valueKey || '');
        setTargetSkill(skill || '');

        const getAllVolunteers = async () => {
            try {
                const { data } = await axios.get(`/api/volunteers/all${search}`);
                setResults(data.payload);
            } catch (err) {
                setFeedback(err);
            }
        }
        getAllVolunteers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);


    useEffect(() => {
        history.push(`/volunteers?skill=${urlTargetSkill}&${urlFilter}=${urlSearchValue}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload, urlFilter, urlTargetSkill, urlSearchValue]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setReload(!reload);
    }

    const hideVolunteer = () => {
        setDisplayTargetUser(false);
        setTargetVolunteerId(null);
    }


    return (
        <>
            <form className='form-inline' onSubmit={handleSubmit}>
                <input className='form-control mb-2 mr-sm-2 min-w-25' type='text'
                    placeholder='Search' value={searchValue} onChange={e => { setUrlSearchValue(e.target.value) }} />

                <select className='form-control mb-2 mr-sm-2' value={filter} onChange={e => setUrlFilter(e.target.value)}>
                    <option value=''>Choose a search filter</option>
                    <option value='name'>Name</option>
                    <option value='v_email'>Email</option>
                    <option value='company'>Company</option>
                </select>

                <select className='form-control mb-2 mr-sm-2' value={targetSkill} onChange={e => setUrlTargetSkill(e.target.value)}>
                    <option value=''>-- Skill --</option>
                    { skillsList.map(skill => <option key={skill.skill + skill.skill_id} value={skill.skill}>{skill.skill}</option>) }
                </select>

                <button className='btn btn-primary mb-2'>Search</button>
            </form>

            {/* List or grid toggle */}
            <div className='g1ToggleListOrGrid'>
                View Mode:
                <label class='g1LeftLabel' for="customSwitch1">List</label>
                <div class="custom-control custom-switch">
                    <input
                        type="checkbox"
                        checked={isDisplayModeGrid}
                        onClick={() => setIsDisplayModeGrid(!isDisplayModeGrid)}
                        class="custom-control-input"
                        id="customSwitch1" />
                    <label class="custom-control-label" for="customSwitch1">Grid</label>
                </div>
            </div>

            {/* Search results */}
            <div className={`g1VolunteerResults ${isDisplayModeGrid ? 'g1ListResults' : 'g1GridResults'}`}>
                {results.map(volunteer => <VolunteerCard
                        key={volunteer.v_id + volunteer.v_first_name + volunteer.v_last_name}
                        volunteer={volunteer}
                        setDisplayTargetUser={setDisplayTargetUser}
                        setTargetVolunteerId={setTargetVolunteerId}
                    />
                )}
            </div>

            <PrimaryModalContainer header={'Volunteer Profile'} className='g1VolunteerModal' runOnModalClose={hideVolunteer}>
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

