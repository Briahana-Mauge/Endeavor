import React from 'react'

export default (props) => {
    let text = 'Sorry, something went wrong \n Please try again'

    if (props.feedback.response && props.feedback.response.data.message) {
        text = props.feedback.response.data.message
    } else if (props.feedback.message) {
        text = props.feedback.message
    } else {
        text = `${props.feedback.response.status} - ${props.feedback.response.statusText}`
    }
     

    return(
        <div className='w-75 mx-auto mt-5 p-2 text-center feedbackContainer'>
            <div className='text-right m-2'>
                <button className='btn-sm btn-danger' onClick={props.resetFeedback}>X</button>
            </div>
            <div>
                <p>{text}</p>
            </div>
        </div>
    )
}