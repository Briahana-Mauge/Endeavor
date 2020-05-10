/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
PrimaryModal Components | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';


export const PrimaryModalContainer = (props) => {
  const { children, header, hideEvent } = props;


  return(
    <div className="modal fade" id="exampleModalLong" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
      <div className="g1ModalDialog modal-dialog" role="document">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLongTitle">{header}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={hideEvent}>
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
    <div className={`modal-body ${className}`}>
      {children}
    </div>
  );
}


export const PMFooter = ({children}) => {
  return(
    <div className="modal-footer py-1">
      {children}
    </div>
  );
}


export default {
  PrimaryModalContainer,
  PMBody,
  PMFooter
}
