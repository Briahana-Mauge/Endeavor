/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
ALink Component | Capstone App (Pursuit Volunteer Mgr)

props ========
dim: if true, the color is gray. defaults false
disabled: if true or if dim is true, clicking link does nothing. defaults true
href: as regular
children: as regular
className: as regular
*/


/* IMPORTS */
import React from 'react';


const ALink = ({ disabled = true, dim = false, href, children, className}) => {

  if (dim) {
    className = "g1DisableLink " + className;
  }

  console.log(className);
  return (
    <li className="nav-item">
      <a
        href={href}
        onClick={(e) => dim || disabled ? e.preventDefault() : true}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    </li>
  );
}

export default ALink;