import React from 'react';
import { Switch, Route } from 'react-router-dom';

import VolunteerSearch from './VolunteerSearch';

export default () => {
    return (
        <Switch>
            <Route to='/volunteers/search'> 
                <VolunteerSearch />
            </Route>
        </Switch>
    )
}
