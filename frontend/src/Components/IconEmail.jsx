/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
IconEmail Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';
import { GrMail } from 'react-icons/gr';


const IconEmail = ({ email, className }) => {
  return(
    <a
      href={`mailto:${email}`}
      className={`g1IconEmail ${className}`}
      target='_blank'
      rel='noopener noreferrer'
    >
      <GrMail />
    </a>
  );
}


export default IconEmail;
