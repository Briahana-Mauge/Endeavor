/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
PrimaryModal Components | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';


export const PrimaryModalContainer = (props) => {
  const { children, header, hideEvent } = props;


  return(
    <div className="modal fade" id="primaryModal" tabIndex="-1" role="dialog" aria-labelledby="primaryModalTitle" aria-hidden="true">
      <div className="g1ModalDialog modal-dialog" role="document">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title" id="primaryModalTitle">{header}</h5>
          </div>
          <div className="g1CloseContainer">
            <button type="button" className="close sticky-top pt-3" data-dismiss="modal" aria-label="Close" onClick={hideEvent}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          {children}

        </div>
      </div>
    </div>
  );
}


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
    <div className="modal-footer py-1">
      <div className={`d-flex w-100 m-2 ${className}`}>
        {children}
      </div>
    </div>
  );
}


export default {
  PrimaryModalContainer,
  PMBody,
  PMFooterSpace,
  PMFooter
}
