import React from 'react';
import { AtomSpinner } from 'react-epic-spinners';

const Spinner = (props) => {
    return (<>
        <AtomSpinner className = 'spinner' color = "8d8558" size = {props.size}   />
        </>
    )
}

export default Spinner;