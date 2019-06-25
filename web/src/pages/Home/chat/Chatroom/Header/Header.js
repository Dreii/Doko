import React from 'react'
import ProfileImg from '../../../../../components/display/ProfileImg/ProfileImg'
import CrownIcon from '../../../../../components/display/Icons/CrownIcon'
import TackIcon from '../../../../../components/display/Icons/TackIcon'
import TackPinnedIcon from '../../../../../components/display/Icons/TackPinnedIcon'
import BackIcon from '../../../../../components/display/Icons/BackIcon'
import Button from '../../../../../components/inputs/Button/Button'
import './Header.css'

const Header = ({user, chatroom, CloseRoom, onPin}) => {

  return (
    <div className="chat-header">
      <Button
        className={`subscription-button ${(chatroom.ownedByUser || chatroom.pinned) ? "pinned":""}`}
        svgIcon={chatroom.ownedByUser ? <CrownIcon/> : chatroom.pinned ? <TackPinnedIcon/>:<TackIcon/>}
        noBack
        onClick={!chatroom.ownedByUser ? onPin:undefined}
      />

      <h1 className="chat-title">{chatroom.name.length > 50 ? `${chatroom.name.substr(0, 50)}...`:chatroom.name}</h1>

      <div className="chat-info">
        <Button className="chat-exit-button" svgIcon={<BackIcon color="#707070" />} onClick={CloseRoom}/>
        <p className="distance">{~~chatroom.distance > 0 ? ~~chatroom.distance+'mi':'> 1mi'}</p>
        <div className="member-list">
          <ProfileImg img={chatroom.creator.image} size={48} className="creator-profile" />
          {chatroom.membersCount > 3 ? <div className="member-count">{chatroom.membersCount<100 ? chatroom.membersCount-3 : "100+"}</div> : null}
          {chatroom.members.map((member, i) => <ProfileImg key={i} className="member-listing" img={member.image} size={48} />)}
        </div>
      </div>
    </div>
  )
}

export default Header
