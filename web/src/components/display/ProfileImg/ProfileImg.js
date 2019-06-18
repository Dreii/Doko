import React from 'react'
import './ProfileImg.css'

class ProfileImg extends React.PureComponent {
  render() {
    let {img, color, size, style, className} = this.props
    return (
      <div className={`profile-img ${className} ${color}`} style={{backgroundImage: `url(${img})`, width: size, height: size}}></div>
    )
  }
}

export default ProfileImg
