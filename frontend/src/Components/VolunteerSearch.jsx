import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VolunteerSearchCard from './VolunteerSearchCard';


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
    constructor() {
        super();
        this.state = {
            search: '',
            loading: true,
            results: [],
            filter: '',
            submitted: false
        }
    }
    componentDidMount = () => {

        this.getAllVolunteers();
    }

    getAllVolunteers = async () => {

        let { results, filter, search } = this.state
        let basic = ''
        if (filter === '') {
            basic = await axios.get(`/api/volunteers/all/`);

        } else if (filter === 'v_email') {
            basic = await axios.get(`/api/volunteers/all/?v_email=${search}`);

        } else if (filter === 'company') {
            basic = await axios.get(`/api/volunteers/all/?company=${search}`);

        }
        else if (filter === 'skill') {
            basic = await axios.get(`/api/volunteers/all/?skill=${search}`);

        } else {
            basic = await axios.get(`/api/volunteers/all/?name=${search}`);
        }


        this.setState({
            results: basic.data.payload
        })
    }

    handleInput = (event) => {
        const { name, value } = event.target
        this.setState({
            [name]: value,
            loading: true
        })
    }
    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState({
            loading: false,
        })

        this.getAllVolunteers();


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
                <div>
                    {results.map(volunteer => {
                        return (

                            <div key={volunteer.v_id}>
                                <VolunteerSearchCard volunteer={volunteer} />

                            </div>

                        )
                    })}
                </div>


            </div>
        );
    }
}

export default VolunteerSearch;
