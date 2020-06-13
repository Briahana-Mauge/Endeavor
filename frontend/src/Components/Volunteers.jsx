import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import axios from 'axios';

import UIResultsModeToggle from './UIResultsModeToggle';
import VolunteerCard from './VolunteerCard';


export default function Volunteers (props) {
    const { search } = useLocation();
    const history = useHistory();
    const { setFeedback, isVolunteerSearchGrided, setIsVolunteerSearchGrided } = props;

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
    const [skillsList, setSkillsList] = useState([]);
    const [reload, setReload] = useState(false);

    
    useEffect(() => {
        let isMounted = true;

        const getSkillsList = () => {
            axios.get('/api/skills')
                .then(response => {
                    if (isMounted) {
                        setSkillsList(response.data.payload);
                    }
                })
                .catch (err => {
                    if (isMounted) {
                        setFeedback(err)
                    }
                });
        }
        
        getSkillsList();

        // Cleanup
        return () => isMounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    useEffect(() => {
        const [searchKey, searchVal, skill] = getQueryStrings();

        setSearchValue(searchVal || '');
        setFilter(searchKey || '');
        setTargetSkill(skill || '');

        let isMounted = true;

        const getAllVolunteers = () => {
            axios.get(`/api/volunteers/all?skill=${skill}&${searchKey}=${searchVal}`)
                .then(response => {
                    if (isMounted) {
                        setResults(response.data.payload);
                    }
                })
                .catch (err => {
                    if (isMounted) {
                        setFeedback(err);
                    }
                })
        }

        getAllVolunteers();
        
        // Cleanup
        return () => isMounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);


    useEffect(() => {
        let urlSearchValueCopy =  urlSearchValue + ''; // force a copy of the state
        urlSearchValueCopy = urlSearchValueCopy.replace(/ /g, '%20'); // replace any blank character by %20
        urlSearchValueCopy = urlSearchValueCopy.replace(/%20%20/g, '%20'); // replace any double blank character or more by one blank character
        history.push(`/volunteers?skill=${urlTargetSkill}&${urlFilter}=${urlSearchValueCopy}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload, urlFilter, urlTargetSkill, urlSearchValue]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setReload(!reload);
    }


    return (
        <>
            {/* Search form */}
            <form className='form-inline' onSubmit={handleSubmit}>
                <input className='form-control mb-2 mr-sm-2 min-w-25' type='text'
                    placeholder='Search' value={searchValue} onChange={e => setUrlSearchValue(e.target.value)} />

                <select className='form-control mb-2 mr-sm-2' value={filter} onChange={e => setUrlFilter(e.target.value)}>
                    <option value=''>Choose a search filter</option>
                    <option value='name'>Name</option>
                    <option value='v_email'>Email</option>
                    <option value='company'>Company</option>
                    <option value='title'>Title</option>
                </select>

                <select className='form-control mb-2 mr-sm-2' value={targetSkill} onChange={e => setUrlTargetSkill(e.target.value)}>
                    <option value=''>-- Skill --</option>
                    { skillsList.map(skill => <option key={skill.skill + skill.skill_id} value={skill.skill}>{skill.skill}</option>) }
                </select>

                <button className='btn btn-primary mb-2'>Search</button>
            </form>

            {/* List or grid toggle */}
            <UIResultsModeToggle
                isDisplayModeGrid={isVolunteerSearchGrided}
                setIsDisplayModeGrid={setIsVolunteerSearchGrided}
                type='volunteers'
                setFeedback={setFeedback}
            />

            {/* Search results */}
            <div className={`g1VolunteerResults ${isVolunteerSearchGrided ? 'g1GridResults' : 'g1ListResults'}`}>
                {isVolunteerSearchGrided
                    ?   null
                    :   <div className='g1VolResultCard px-1'>
                            <div className='g1InnerVolResultCard g1InnerVolResultCard__Header'>
                                <div className='g1VRHeader--empty1'></div>
                                <div className='g1VRHeader--name'>Name</div>
                                <div className='g1VRHeader--empty2'></div>
                                <div className='g1VRHeader--job'>Company + Position</div>
                                <div className='g1VRHeader--skills'>Skills</div>
                                <div className='g1VRHeader--interests'>Interests</div>
                                <div className='g1VRHeader--nextevent'>Next Event</div>
                            </div>
                        </div>
                }
                {results.map(volunteer => <VolunteerCard
                        key={volunteer.v_id + volunteer.v_first_name + volunteer.v_last_name}
                        volunteer={volunteer}
                    />
                )}
            </div>
        </>
    );
}

