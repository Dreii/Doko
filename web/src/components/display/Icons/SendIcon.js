import React from 'react'

import './Icons.css'

const SendIcon = ({color, className}) => (
  <svg className={`svg-icon ${className}`} xmlns="http://www.w3.org/2000/svg" width="19.36" height="18.932" viewBox="0 0 19.36 18.932">
    <g id="send-icon" data-name="send" transform="translate(17.239 16.811) rotate(180)">
      <line id="Line_11" data-name="Line 11" x2="15.739" transform="translate(0 7.345)" fill="none" stroke={color} strokeLinecap="round" strokeWidth="3"/>
      <line id="Line_12" data-name="Line 12" y1="7.345" x2="7.345" transform="translate(0 0)" fill="none" stroke={color} strokeLinecap="round" strokeWidth="3"/>
      <line id="Line_13" data-name="Line 13" x2="7.345" y2="7.345" transform="translate(0 7.345)" fill="none" stroke={color} strokeLinecap="round" strokeWidth="3"/>
    </g>
  </svg>
)

export default SendIcon
