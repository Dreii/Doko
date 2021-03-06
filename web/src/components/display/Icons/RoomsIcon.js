import React from 'react'

import './Icons.css'

const RoomsIcon = ({color, className}) => (
  <svg className={`svg-icon ${className}`} xmlns="http://www.w3.org/2000/svg" width="23" height="21" viewBox="0 0 23 21">
    <g id="rooms-icon" data-name="Group 42" transform="translate(-29 -22)">
      <line id="Line_3" data-name="Line 3" x2="14" transform="translate(36.5 23.5)" fill="none" stroke={color} strokeLinecap="round" strokeWidth="3"/>
      <line id="Line_4" data-name="Line 4" x2="20" transform="translate(30.5 32.5)" fill="none" stroke={color} strokeLinecap="round" strokeWidth="3"/>
      <line id="Line_5" data-name="Line 5" x2="7" transform="translate(43.5 41.5)" fill="none" stroke={color} strokeLinecap="round" strokeWidth="3"/>
    </g>
  </svg>
)

export default RoomsIcon
