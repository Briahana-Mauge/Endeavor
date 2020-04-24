import React from 'react'

export default function Feedback(props) {
    let text = 'Sorry, something went wrong \n Please try again'

    if (props.feedback.response && props.feedback.response.data.message) {
        text = props.feedback.response.data.message
    } else if (props.feedback.message) {
        text = props.feedback.message
    } else {
        text = `${props.feedback.response.status} - ${props.feedback.response.statusText}`
    }


    return(
        <div className='p-2 text-center feedbackContainer col-12 col-md-11 col-lg-10 col-xl-8 p-0 mx-auto'>
            <div className='text-right m-2 closeButton'>
                <button className='btn-sm btn-danger' onClick={props.resetFeedback}>X</button>
            </div>
            <div>
                <p>{text}</p>
            </div>
        </div>
    )
}