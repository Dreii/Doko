import React from 'react'

import './Icons.css'

const SearchIcon = ({color, className}) => (
  <svg className={`svg-icon ${className}`} xmlns="http://www.w3.org/2000/svg" width="28.758" height="28.758" viewBox="0 0 28.758 28.758">
    <g id="magnifying_glass" data-name="magnifying glass" transform="translate(124.758 -186.992)">
      <line id="Line_2" data-name="Line 2" x2="4.789" y2="4.539" transform="translate(-103.5 208.5)" fill="none" stroke={color} strokeLinecap="round" strokeWidth="3"/>
      <g id="Ellipse_31" data-name="Ellipse 31" transform="translate(-124.758 201.371) rotate(-45)" fill="none" stroke={color} strokeLinecap="round" strokeWidth="3">
        <circle cx="10.168" cy="10.168" r="10.168" stroke="none"/>
        <circle cx="10.168" cy="10.168" r="8.668" fill="none"/>
      </g>
    </g>
  </svg>
)

export default SearchIcon
