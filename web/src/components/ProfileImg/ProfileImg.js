import React from 'react'

import './ProfileImg.css'

const ProfileImg = ({img, color, size, style, className}) => (
  <div className={`profile-img ${className} ${color}`} style={{backgroundImage: `url(${img})`, width: size, height: size}}></div>
)

export default ProfileImg
