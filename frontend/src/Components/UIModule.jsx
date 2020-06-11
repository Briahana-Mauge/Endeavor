/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
UI Module Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';


const UIModule = ({children, className = '', titleColor = '', titleRegular = ''}) => {
  const xPaddingForAllModules = "px-2";

  return(
    <div className={`g1Module card mb-3 ${className}`}>
      <div className="g1Module__Inner">
        <h3 className={`g1Module__Header ${xPaddingForAllModules}`} style={{fontSize: '1.2rem'}}>

          <span className='g1HeaderColor'>{titleColor}</span> {titleRegular}

        </h3>
        <div className={`g1Module__Body ${xPaddingForAllModules}`}>
        {/* <div className={`g1Module__body pt-0 pb-1 ${xPaddingForAllModules}`}> */}

          {children}

        </div>
      </div>
    </div>
  )
}


export default UIModule;
