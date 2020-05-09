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
      <div className="modal-dialog" role="document">
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


export const PMBody = ({children}) => {
  return(
    <div className="modal-body">
      {children}
    </div>
  );
}


export const PMFooter = ({children}) => {
  return(
    <div className="modal-footer">
      {children}
      {/* <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
      <button type="button" className="btn btn-primary">Save changes</button> */}
    </div>
  );
}


export default {
  PrimaryModalContainer,
  PMBody,
  PMFooter
}
