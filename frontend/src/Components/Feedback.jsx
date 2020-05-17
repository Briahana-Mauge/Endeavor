import React, { useState } from 'react'

export default function Feedback({ feedback, resetFeedback }) {
    const [ secondaryModalKill, setSecondaryModalKill ] = useState({})

    const handleCloseFeedback = () => {
        setSecondaryModalKill({ display: 'none' });
        resetFeedback();
        setTimeout(() => setSecondaryModalKill({}), 0);
    }

    let
        secondaryModalToggleClass = '',
        msg = 'Sorry, something went wrong \n Please try again';
    if (feedback) {
        secondaryModalToggleClass = 'g1FeedbackOn';
        if (feedback.response && feedback.response.data.message) {
            msg = feedback.response.data.message;
        } else if (feedback.message) {
            msg = feedback.message;
        } else {
            msg = `${feedback.response.status} - ${feedback.response.statusText}`;
        }
    }


    return(
        // <div className='p-2 text-center feedbackContainer col-12 col-md-11 col-lg-10 col-xl-8 p-0 mx-auto'>
        <div className={`g1SecondaryModal ${secondaryModalToggleClass}`} style={secondaryModalKill}>
            <button type='button' className='g1SecondaryModalClose close pt-2' onClick={handleCloseFeedback}><span>&times;</span></button>
            <div className='mt-4'>
                <p>{msg}</p>
            </div>
        </div>
    );
}
