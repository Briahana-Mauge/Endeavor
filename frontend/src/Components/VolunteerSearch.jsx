import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VolunteerSearchCard from './VolunteerSearchCard';
import { Link, Route, Switch } from 'react-router-dom';


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










// setSearch('newstring');


// this.setState = ({
//search: new variable
// })

// [e.target.name]: e.target.value

// }

class VolunteerSearch extends React.Component {
    constructor() {
        super();
        this.state = {
            search: '',
            loading: true,
            results: []
        }
    }
    componentDidMount = async () => {
        let basic = await axios.get(`/api/volunteers/all`);
        this.setState({
            results: basic.data.payload
        })
    }

    getAllVolunteers = () => {
        let { results } = this.state
        console.log(results)
        return (
            <div>
                {results.map(volunteer => {
                    return (

                        <div key={volunteer.v_id}>
                            <VolunteerSearchCard volunteer={volunteer} />

                        </div>

                    )
                })}
            </div>

        )




        try {
            // event.preventDefault();
            // let basic = await axios.get(`/api/volunteers/all`);
            let newResults = []
            let basic = 0
            // console.log(basic.data.payload);
            let volunteers = basic.data.payload
            for (let i = 0; i < volunteers.length; i++) {
                newResults.push({

                    picture: volunteers[i].v_picture,
                    name: volunteers[i].v_first_name + ' ' + volunteers[i].v_last_name,
                    company: volunteers[i].company,
                    title: volunteers[i].title,
                    email: volunteers[i].v_email,
                    skills: 'none',
                    nextEvent: 'none'
                })
            }
            this.setState({
                results: newResults
            })
            // console.log('results', newResults)

        } catch (error) {
            console.log(error)
        }

    }
    handleSubmit = async (event) => {
        event.preventDefault();
        const { search } = this.state;
        let volunteers = [];
        let newResults = [];
        console.log('onclick works')

    }
    render = () => {
        // console.log(this.state.results)
        return (
            <div className="Search">
                <input type='text' placeholder='Search' />
                <input type='button' value='Send' /* onClick={this.getVolunteers}*/ />

                <Switch>
                    <Route exact path="/volunteers/search" render={this.getAllVolunteers} />
                </Switch>
            </div>
        );
    }
}

export default VolunteerSearch;
