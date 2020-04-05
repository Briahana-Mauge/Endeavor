import React from 'react'

export default (props) => {
    let text = 'Sorry, something went wrong \n Please try again'

    if (props.err.message) {
        text = props.err.message
    } else if (props.err.response && props.err.response.data.message) {
        text = props.err.response.data.message
    } else {
        text = `${props.err.response.status} - ${props.err.response.statusText}`
    }
     

    return(
        <div className='w-75 mx-auto mt-5 p-2 text-center feedbackContainer'>
            <div className='text-right m-2'>
                <button className='btn-sm btn-danger' onClick={props.resetNetworkError}>X</button>
            </div>
            <div>
                <p>{text}</p>
            </div>
        </div>
    )
}