import React from 'react'

import './Icons.css'

const LocationIcon = ({color, className}) => (
  <svg className={`svg-icon ${className}`} xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29">
    <g id="location-icon" transform="translate(-324.5 -627.5)">
      <g id="Ellipse_33" data-name="Ellipse 33" transform="translate(324.5 627.5)" fill="none" stroke={color} strokeWidth="3">
        <circle cx="14.5" cy="14.5" r="14.5" stroke="none"/>
        <circle cx="14.5" cy="14.5" r="13" fill="none"/>
      </g>
      <g id="Ellipse_34" data-name="Ellipse 34" transform="translate(332.5 635.5)" fill={color} stroke={color} strokeWidth="3">
        <circle cx="6.5" cy="6.5" r="6.5" stroke="none"/>
        <circle cx="6.5" cy="6.5" r="5" fill="none"/>
      </g>
    </g>
  </svg>
)

export default LocationIcon
