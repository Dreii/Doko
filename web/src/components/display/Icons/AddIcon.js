import React from 'react'

import './Icons.css'

const AddIcon = ({color, className}) => (
  <svg className={`svg-icon ${className}`} xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23">
    <g id="add-icon" data-name="Group 37" transform="translate(-29 -21)">
      <line id="Line_4" data-name="Line 4" x2="20" transform="translate(30.5 32.5)" fill="none" stroke={color} strokeLinecap="round" strokeWidth="3"/>
      <line id="Line_16" data-name="Line 16" x2="20" transform="translate(40.5 22.5) rotate(90)" fill="none" stroke={color} strokeLinecap="round" strokeWidth="3"/>
    </g>
  </svg>
)

export default AddIcon
