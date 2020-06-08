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
        <h3 className={`g1Module__Header ${xPaddingForAllModules}`}>

          <span className='g1HeaderColor'>{titleColor}</span> {titleRegular}

        </h3>
        <div className={`g1Module__Body ${xPaddingForAllModules}`}>

          {children}

        </div>
      </div>
    </div>
  )
}


export default UIModule;
