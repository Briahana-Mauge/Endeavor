import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VolunteerResults from './VolunteerResults';


const VolunteerSearch = () => {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);

    const getVolunteers = async () => {
        try {
            let basic = await axios.get(`/api/volunteers/all`);
            let answer = []
            console.log(basic.data.payload);

            basic.data.payload.forEach(e => {

                let userInfo = {
                    picture: e.v_picture,
                    name: e.v_first_name + ' ' + e.v_last_name,
                    company: e.company,
                    title: e.title,
                    email: e.v_email,
                    skills: 'none',
                    nextEvent: 'none'
                }
                answer.push(userInfo)
            })

            setResults(answer)
            console.log('results', answer)

        } catch (error) {
            console.log(error)
        }
     
    }

    useEffect(() => {
        getVolunteers();
    }, [])

    return (
        <div className="Search">
            <input type='text' placeholder='Search' />
            <input type='button' value='Send' />

            <VolunteerResults />
        </div>
    );
    // setSearch('newstring');

    
    // this.setState = ({
    //search: new variable
    // })

    // [e.target.name]: e.target.value

}

// class VolunteerSearch extends React.Component {
//     constructor() {
//         super();
//         this.state = {
//             search: '',
//             loading: true,
//             results: []
//         }
//     }
//     componentDidMount = async () => {
//         try {
//             let basic = await axios.get(`/api/volunteers/all`);
//             let results = []
//             console.log(basic.data.payload);
//             basic.data.payload.forEach( e => {

//                 let userInfo = {
//                     picture: e.v_picture,
//                     name: e.v_first_name + ' ' + e.v_last_name,
//                     company: e.company,
//                     title: e.title,
//                     email: e.v_email,
//                     skills: 'none',
//                     nextEvent: 'none'
//                 }
//                 results.push(userInfo)
//             })
//             console.log('results', results)

//         } catch (error) {
//             console.log(error)
//         }

//     }
//     handleSubmit = async (event) => {
//         event.preventDefault();
//         const { search } = this.state;
//         let volunteers = [];
//         let newResults = [];
//         console.log('onclick works')

//     }
//     render = () => {
        // return (
        //     <div className="Search">
        //         <input type='text' placeholder='Search' />
        //         <input type='button' value='Send' onClick={this.handleSubmit} />

        //         <VolunteerResults />
        //     </div>
        // );
//     }
// }

export default VolunteerSearch;
