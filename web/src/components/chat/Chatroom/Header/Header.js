import React from 'react'
import ProfileImg from '../../../display/ProfileImg/ProfileImg'
import TackIcon from '../../../display/Icons/TackIcon'
import TackPinnedIcon from '../../../display/Icons/TackPinnedIcon'
import Button from '../../../inputs/Button/Button'
import './Header.css'

const Header = ({user, chatroom, membersCount, membersDisplay, CloseRoom}) => {
  return (
    <div className="chat-header">

      <Button
        className={`subscription-button ${chatroom.pinned ? "pinned":""}`}
        svgIcon={chatroom.creator._id === user._id ? null : chatroom.pinned ? <TackPinnedIcon/>:<TackIcon/>}
        noBack
        // onClick={this.onPin}
      />

      <h1 className="chat-title">{chatroom.name.length > 50 ? `${chatroom.name.substr(0, 50)}...`:chatroom.name}</h1>

      <div className="chat-info">
        <Button className="chat-exit-button" icon="/back-icon.svg" onClick={CloseRoom}/>
        <p className="distance">{~~chatroom.distance > 0 ? ~~chatroom.distance+'mi':'> 1mi'}</p>
        <div className="member-list">
          <ProfileImg img={chatroom.creator.image} size={48} className="creator-profile" />
          {membersCount > 3 ? <div className="member-count">{membersCount<100 ? membersCount-3 : "100+"}</div> : null}
          {membersDisplay.map((member, i) => <ProfileImg key={i} className="member-listing" img={member.image} size={48} />)}
        </div>
      </div>
    </div>
  )
}

export default Header
