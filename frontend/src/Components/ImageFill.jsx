/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
ImageFill Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';

const images = [
  require('../assets/images/backgrounds/alejogameon.jpg'),
  require('../assets/images/backgrounds/percygreenlist.jpg'),
  require('../assets/images/backgrounds/shawnapanel.jpg'),
  require('../assets/images/backgrounds/staffzoom.jpg'),
  require('../assets/images/backgrounds/stepssolo.jpg'),
  require('../assets/images/backgrounds/uber62hackathonwinners.jpg')
];
const randomImage = images[Math.floor(Math.random() * 6)];


const ImageFill = () => {
  return(
    <img className='g1FillerImage mb-3' src={randomImage} alt='Volunteers and Fellows Highlight' />
  );
}


export default ImageFill;
