import React from 'react';

export default function Feedback({ feedback, resetFeedback }) {
    let secondaryModalToggle = '';
    let msg = <><strong>Error: </strong>Sorry, something went wrong. <br />Please try again</>;

    if (feedback) {
        secondaryModalToggle = 'g1FeedbackOn';
        if (feedback.response && feedback.response.data.message) {
            msg = feedback.response.data.message;
        } else if (feedback.message) {
            msg = feedback.message;
        } else {
            msg = `${feedback.response.status} - ${feedback.response.statusText}`;
        }
        if (msg.slice(0, 6) === 'Error:') {
            msg = <><strong>{msg.slice(0, 6)}</strong>{msg.slice(6)}</>
        }
    }


    return(
        // <div className='p-2 text-center feedbackContainer col-12 col-md-11 col-lg-10 col-xl-8 p-0 mx-auto'>
        <div className={`g1SecondaryModal ${secondaryModalToggle}`}>
            <div className='g1SModalHeader'>
                <button type='button' className='g1SecondaryModalClose close' onClick={resetFeedback}><span>&times;</span></button>
            </div>
            <div className='g1SModalBody mt-4'>
                <p>{msg}</p>
            </div>
            <div className='g1SModalFooter'></div>
        </div>
    );
}
