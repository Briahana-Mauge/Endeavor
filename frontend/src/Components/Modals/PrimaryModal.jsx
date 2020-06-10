/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
PrimaryModal Components | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';


export const PMBody = ({className = '', children}) => {
  return(
    <div className={`modal-body pb-2 ${className}`}>
      {children}
    </div>
  );
}


export const PMFooterSpace = () => <span className='flex-fill'></span>;


export const PMFooter = ({children, className = ''}) => {
  return(
    <div className='modal-footer py-1'>
      <div className={`d-flex w-100 m-2 ${className}`}>
        {children}
      </div>
    </div>
  );
}


export default {
  PMBody,
  PMFooterSpace,
  PMFooter
}
