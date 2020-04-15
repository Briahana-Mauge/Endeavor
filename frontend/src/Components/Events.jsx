import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventsSearchCard from './EventsCard';
import { Link, Route, Switch } from 'react-router-dom';

//Class component
class EventSearch extends React.Component {
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

        this.getAllEvents();
    }

    getAllEvents = async () => {

        let { filter, search } = this.state
        let basic = ''
        if (filter === '') {
            basic = await axios.get(`/api/events/all/`);

        } else if (filter === 'v_name') {
            basic = await axios.get(`/api/events/all/?v_name=${search}`);

        } else if (filter === 'instructor') {
            basic = await axios.get(`/api/events/all/?instructor=${search}`);

        }else if (filter === 'topic') {
            basic = await axios.get(`/api/events/all/?topic=${search}`);

        }
        else if (filter === 'skill') {
            basic = await axios.get(`/api/events/all/?upcoming=${search}`);

        } else {
            basic = await axios.get(`/api/events/all/?past=${search}`);
        }


        this.setState({
            results: basic.data.payload
        })
    }

    handleInput = (event) => {
        const { name, value } = event.target
        // if(event.name)
        this.setState({
            [name]: value,
            loading: true
        })
    }
    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState({
            loading: false,
            filter: ''
        })

        this.getAllEvents();


    }
    render = () => {

        const { results, filter } = this.state
        console.log(results)
        return (
            <div className="Search">
        
                <form>
                    {
                    this.state.filter === 'upcoming' || this.state.filter === 'past'? 
                    <input type='text' name='search' placeholder='Press Send' onChange={this.handleInput} value={this.setState.search} disabled/>
                   : <input type='text' name='search' placeholder='Search' onChange={this.handleInput} value={this.setState.search} />

                    }
                    
                    <select className='filter' name='filter' onChange={this.handleInput}>
                        <option value={false} key='null'>Choose a search filter</option>
                        <option value='topic' key='name'>Event Name</option>
                        <option value='v_name' key='v_name'>Volunteer</option>
                        <option value='instructor' key='instructor'>Instructor</option>
                        <option value='upcoming' key='upcoming'>Upcoming events</option>
                        <option value='past' key='past'>Past events</option>
                        
                    </select>
                    <input type='button' value='Send' onClick={this.handleSubmit} />
                </form>
                <div>
                    {results.map(event => {
                        return (

                            <div key={event.event_id}>
                                <EventsSearchCard event={event} />

                            </div>

                        )
                    })}
                </div>


            </div>
        );
    }
}

export default EventSearch;