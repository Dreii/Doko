import React from 'react'

import './Icons.css'

const BackIcon = ({color, className}) => (
  <svg className={`svg-icon ${className}`} xmlns="http://www.w3.org/2000/svg" width="26.109" height="25.231" viewBox="0 0 26.109 25.231">
    <g id="back-icon" transform="translate(-26.702 -33.747)">
      <line id="Line_11" data-name="Line 11" x2="22.488" transform="translate(28.823 46.363)" fill="none" stroke={color} strokeLinecap="round" strokeWidth="3"/>
      <line id="Line_12" data-name="Line 12" y1="10.494" x2="10.494" transform="translate(28.823 35.869)" fill="none" stroke={color} strokeLinecap="round" strokeWidth="3"/>
      <line id="Line_13" data-name="Line 13" x2="10.494" y2="10.494" transform="translate(28.823 46.363)" fill="none" stroke={color} strokeLinecap="round" strokeWidth="3"/>
    </g>
  </svg>
)

export default BackIcon
