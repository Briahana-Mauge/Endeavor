import React, { useState } from 'react';
import axios from 'axios';


export default function UsersTab(props) {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ role, setRole ] = useState('');

    const handleFromSubmit = async (e) => {
        e.preventDefault();

        try {
            if (email && password && role) {
                const { data } = await axios.post(`/api/users/${role}/add`, {email, password});
                props.setFeedback(data);
            } else {
                props.setFeedback({message: 'All fields are required'});
            }
        } catch (err) {
            props.setFeedback(err);
        }
    }

    return (
        <form className='form-inline mt-4' onSubmit={handleFromSubmit}>
            <input 
                type='email' 
                className='form-control mb-2 mr-sm-2' 
                placeholder='Enter email'
                value={email}
                onChange={e => setEmail(e.target.value)}
            />

            <input 
                type='password' 
                className='form-control mb-2 mr-sm-2' 
                placeholder='Enter default password'
                value={password}
                onChange={e => setPassword(e.target.value)}
            />

            <select className='form-control mb-2 mr-sm-2' value={role} onChange={e => setRole(e.target.value)}>
                <option value=''>-User Role-</option>
                <option value='admin'>Admin</option>
                <option value='staff'>Staff</option>
                <option value='fellow'>Fellow</option>
            </select>

            <button type='submit' className='btn btn-primary mb-2'>Submit</button>
        </form>
    )
}
