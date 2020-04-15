import React, { useState, useEffect } from 'react';
import axios from 'axios';


export default function Skills(props) {
    const { setFeedback } = props;

    const [ skillsList, setSkillsList ] = useState([]);
    const [ skillName, setSkillName ] = useState('');
    const [ tracker, setTracker ] = useState({});
    const [ reload, setReload ] = useState(0);
    
    useEffect(() => {
        const getSkillsList = async () => {
            try {
                const { data } = await axios.get('/api/skills');
                setSkillsList(data.payload);
                const map = {};
                for (let elem of data.payload) {
                    map[elem.skill_id] = elem.skill;
                }
                setTracker(map);
    
            } catch (err) {
                setFeedback(err);
            }
        }

        getSkillsList();
    }, [setFeedback, reload]);

    const deleteSkill = async (skillId) => {
        try {
            const { data } = await axios.delete(`/api/skills/del/${skillId}`);
            // getSkillsList();
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

    const editSkill = async (skillId, text) => {
        try {
            if (text) {
                const { data } = await axios.put(`/api/skills/edit/${skillId}`, {skill: text});
                // getSkillsList();
                setReload(reload + 1);
                setFeedback(data);
            } else {
                setFeedback({message: 'Please enter a skill'});
            }
        } catch (err) {
            setFeedback(err);
        }
    }

    const addSkill = async () => {
        try {
            if (skillName) {
                const { data } = await axios.post(`/api/skills/add`, {skill: skillName});
                // getSkillsList();
                setReload(reload + 1);
                setFeedback(data);
            } else {
                setFeedback({message: 'Please enter a skill'});
            }
        } catch (err) {
            setFeedback(err);
        }
    }

    return (
        <div className='mt-4 text-center'>
            <input 
                type='text' 
                className='inputFormText mb-2 mr-sm-2' 
                placeholder='Enter skill'
                value={skillName}
                onChange={e => setSkillName(e.target.value)}
            />
            <button className='btn btn-info mx-2 my-1' onClick={addSkill}>Add</button>
            

            {
                skillsList.map(skill => <div className='d-flex justify-content-between' key={skill.skill_id + skill.skill}>
                    <input 
                        type='text' 
                        className='inputFormText mb-2 mr-sm-2 flex-grow-1' 
                        placeholder='Enter skill'
                        value={tracker[skill.skill_id]}
                        onChange={e => handleInputEdit(e, skill.skill_id)}
                    />
                    <div className=''>
                        <button className='btn btn-info mx-2 my-1' onClick={e => editSkill(skill.skill_id, tracker[skill.skill_id])}>Save</button>
                        <button className='btn btn-danger mx-2 my-1' onClick={e => deleteSkill(skill.skill_id)}>Delete</button>
                    </div>
                </div>)
            }
        </div>
    )
}
