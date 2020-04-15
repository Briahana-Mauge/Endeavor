import React, { useState, useEffect } from 'react';
import axios from 'axios';

import VolunteerSearchCard from './VolunteerSearchCard';
import ProfileRender from './ProfilePages/ProfileRender';


// React Hooks
// const VolunteerSearch = () => {
//     const [search, setSearch] = useState('');
//     const [results, setResults] = useState([]);

//     const getVolunteers = async () => {
//         try {
//             let basic = await axios.get(`/api/volunteers/all`);
//             let answer = []
//             console.log(basic.data.payload);

//             basic.data.payload.forEach(e => {

//                 let userInfo = {
//                     picture: e.v_picture,
//                     name: e.v_first_name + ' ' + e.v_last_name,
//                     company: e.company,
//                     title: e.title,
//                     email: e.v_email,
//                     skills: 'none',
//                     nextEvent: 'none'
//                 }
//                 answer.push(userInfo)
//             })

//             setResults(answer)



//         } catch (error) {
//             console.log(error)
//         }

//     }

//     useEffect(() => {
//         getVolunteers();
//     }, [])

//     return (
//         <div className="Search">
//             <input type='text' placeholder='Search' />
//             <input type='button' value='Send' />

//             <VolunteerSearchCard results={results} />
//             {console.log(results)}

//         </div>
//     );
// }





//Class component
class VolunteerSearch extends React.Component {
    state = {
        search: '',
        // loading: true,
        results: [],
        filter: '',
        submitted: false,
        targetVolunteerId: 0,
        displayTargetUser: false
    }
    
    componentDidMount = () => {
        this.getAllVolunteers();
    }

    getAllVolunteers = async () => {
        try {
            const { filter, search } = this.state
            let response = null;
    
            if (filter === '') {
                response = await axios.get(`/api/volunteers/all/`);
    
            } else if (filter === 'v_email') {
                response = await axios.get(`/api/volunteers/all/?v_email=${search}`);
    
            } else if (filter === 'company') {
                response = await axios.get(`/api/volunteers/all/?company=${search}`);
    
            }
            else if (filter === 'skill') {
                response = await axios.get(`/api/volunteers/all/?skill=${search}`);
    
            } else {
                response = await axios.get(`/api/volunteers/all/?name=${search}`);
            }
    
            this.setState({
                results: response.data.payload
            })
        } catch (err) {
            this.props.setFeedback(err);
        }
    }

    handleInput = (event) => {
        const { name, value } = event.target
        this.setState({
            [name]: value,
            // loading: true
        })
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState({
            // loading: false,
        })

        this.getAllVolunteers();
    }

    setTargetVolunteerId = (id) => {
        this.setState({
            targetVolunteerId: id
        })
    }

    displayProfile = () => {
        this.setState({
            displayTargetUser: true
        })
    }

    hideProfile = () => {
        this.setState({
            displayTargetUser: false
        })
    }

    render = () => {

        const { results } = this.state
        return (
            <div className="Search">
                <form>
                    <input type='text' name='search' placeholder='Search' onChange={this.handleInput} value={this.setState.search} />
                    <input type='button' value='Send' onClick={this.handleSubmit} />
                    <select className='filter' name='filter' onChange={this.handleInput}>
                        <option value={false} key='null'>Choose a search filter</option>
                        <option value='name' key='name'>Name</option>
                        <option value='v_email' key='v_email'>Email</option>
                        <option value='company' key='company'>Company</option>
                        <option value='skill' key='skills'>Skill</option>
                    </select>
                </form>

                <div className='d-flex flex-wrap justify-content-around'>
                    {results.map(volunteer => 
                        <div className='border align-self-stretch'
                            key={volunteer.v_id + volunteer.v_first_name + volunteer.v_last_name}>
                            <VolunteerSearchCard 
                                volunteer={volunteer} 
                                displayProfile={this.displayProfile} 
                                setTargetVolunteerId={this.setTargetVolunteerId}
                            />
                        </div>
                    )}
                </div>

                {
                    this.state.displayTargetUser 
                    ? <ProfileRender 
                        volunteerId={this.state.targetVolunteerId} 
                        hideProfile={this.hideProfile} 
                        setFeedback={this.props.setFeedback}
                        loggedUser={this.props.loggedUser}
                        />
                    : null
                }
            </div>
        );
    }
}

export default VolunteerSearch;
