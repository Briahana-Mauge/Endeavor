import React from 'react';
import { AtomSpinner } from 'react-epic-spinners';

const Spinner = (props) => {
    let size='300';
    if(props.size){
        size = props.size
    } 
    
    return (
        <AtomSpinner className = {`spinner ${props.className}`} color = "#8d8558" size = {size}/>
       
    )
}

export default Spinner;