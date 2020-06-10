/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
UIResultsModeToggle Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';
import axios from 'axios';


const UIResultsModeToggle = ({ type, isDisplayModeGrid, setIsDisplayModeGrid, setFeedback }) => {
  const handleViewChange = async () => {
    try {
      const { data } = await axios.patch(`/api/view/`, {targetView: type});
      setIsDisplayModeGrid(data.payload.e_grid || data.payload.v_grid || false);
    } catch(err) {
      setFeedback(err);
    }
  }

  return(
    <div className='g1ToggleListOrGrid'>
      <span>View Mode:</span>
      <label className='g1LeftLabel' htmlFor="customSwitch1">List</label>
      <div className="custom-control custom-switch">
        <input
          type="checkbox"
          checked={isDisplayModeGrid}
          onChange={handleViewChange}
          className="custom-control-input"
          id="customSwitch1" />
        <label className="custom-control-label" htmlFor="customSwitch1">Grid</label>
      </div>
    </div>
  );
}


export default UIResultsModeToggle;
