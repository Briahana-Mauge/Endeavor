import React from 'react';
import { AtomSpinner } from 'react-epic-spinners';

const Spinner = (props) => {
    return (
        <AtomSpinner className = {`spinner ${props.className}`} color = "#8d8558" size = {props.size || 300}/>
    );
}

export default Spinner;
