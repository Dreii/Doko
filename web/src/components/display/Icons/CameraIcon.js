import React from 'react'

import './Icons.css'

const CameraIcon = ({color, className}) => (
  <svg className={`svg-icon ${className}`} xmlns="http://www.w3.org/2000/svg" width="36.41" height="32.769" viewBox="0 0 36.41 32.769">
    <path id="camera-icon" d="M14.744,3A3.662,3.662,0,0,0,11.1,6.641V8.462H5.641A3.662,3.662,0,0,0,2,12.1V32.128a3.662,3.662,0,0,0,3.641,3.641H34.769a3.662,3.662,0,0,0,3.641-3.641V12.1a3.662,3.662,0,0,0-3.641-3.641H29.308V6.641A3.662,3.662,0,0,0,25.667,3Zm0,3.641H25.667V8.462A3.662,3.662,0,0,0,29.308,12.1h5.462V32.128H5.641V12.1H11.1a3.662,3.662,0,0,0,3.641-3.641Zm5.462,7.282a7.282,7.282,0,1,0,7.282,7.282A7.31,7.31,0,0,0,20.205,13.923Zm10.923,0a1.821,1.821,0,1,0,1.821,1.821A1.821,1.821,0,0,0,31.128,13.923ZM20.205,17.564a3.641,3.641,0,1,1-3.641,3.641A3.614,3.614,0,0,1,20.205,17.564Z" transform="translate(-2 -3)" fill={color}/>
  </svg>
)

export default CameraIcon
