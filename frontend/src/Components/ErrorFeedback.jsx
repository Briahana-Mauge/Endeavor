import React from 'react'

export default (props) => {
    let text = 'Sorry, something went wrong \n Please try again'
    if (props.err.response) {
      if (props.err.response.data.message) {
          text = props.err.response.data.message
      } else {
          text = `${props.err.response.data}: ${props.err.response.status} - ${props.err.response.statusText}`
      }
    } else if (props.err.message) {
        text = props.err.message
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