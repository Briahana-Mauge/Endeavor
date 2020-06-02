/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
UIResultsModeToggle Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';


const UIResultsModeToggle = ({ isDisplayModeGrid, setIsDisplayModeGrid }) => {
  return(
    <div className='g1ToggleListOrGrid'>
      <span>View Mode:</span>
      <label className='g1LeftLabel' htmlFor="customSwitch1">List</label>
      <div className="custom-control custom-switch">
        <input
          type="checkbox"
          checked={isDisplayModeGrid}
          onChange={() => setIsDisplayModeGrid(!isDisplayModeGrid)}
          className="custom-control-input"
          id="customSwitch1" />
        <label className="custom-control-label" htmlFor="customSwitch1">Grid</label>
      </div>
    </div>
  );
}


export default UIResultsModeToggle;
