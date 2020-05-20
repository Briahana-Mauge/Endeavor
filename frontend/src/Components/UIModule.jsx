/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
UI Module Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';


const UIModule = ({children, className = '', titleColor = '', titleRegular = ''}) => {
  const xPaddingForAllModules = "px-2";

  return(
    <div className={`g1Module card mb-2 ${className}`}>
      <div className="g1ModuleInner">
        <h3 className={`g1Module__header card-header ${xPaddingForAllModules}`}>

          <span>{titleColor}</span> {titleRegular}

        </h3>
        <div className={`g1Module__body card-body pt-0 pb-1 ${xPaddingForAllModules}`}>

          {children}

        </div>
      </div>
    </div>
  )
}


export default UIModule;
