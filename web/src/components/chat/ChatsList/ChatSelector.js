import React from 'react'
import './ChatsList.css'

import ProfileImg from '../../display/ProfileImg/ProfileImg'

import Button from '../../inputs/Button/Button'
import TackIcon from '../../display/Icons/TackIcon'
import TackPinnedIcon from '../../display/Icons/TackPinnedIcon'

class ChatSelector extends React.PureComponent {

  onClick = () => this.props.onClick(this.props.room, this.props.index)

  onPin = (e) => {
    e.stopPropagation()
    this.props.PinRoom(this.props.room._id)
  }

  render() {
    let {index, room, membersCount, memberDisplay, messages, active, style, onClick, PinRoom, pinned, ownedByUser} = this.props
    console.log("selector render")

    return (
      <div
        className={`chat ${room.color} ${active ? "active":""}`}
        style={style}
        onClick={this.onClick}
      >
        <h1 className="title">{room.name.length > 22 ? room.name.substr(0, 22)+'...':room.name}</h1>
        <Button
          className={`subscription-button ${pinned ? "pinned":""}`}
          svgIcon={ownedByUser ? null : pinned ? <TackPinnedIcon/>:<TackIcon/>}
          noBack
          onClick={this.onPin}
        />
        <div className="chat-info">
          <p className="distance">{~~room.distance > 0 ? ~~room.distance+'mi':'> 1mi'}</p>
          <div className="member-list">
            <ProfileImg img={room.creator.image} size={48} className="creator-profile" />
            {membersCount > 3 ? <div className="member-count">{membersCount<100 ? membersCount-3 : "100+"}</div> : null}
            {memberDisplay.map((member, i) => <ProfileImg key={i} className="member-listing" img={member.image} size={48} />)}
          </div>
        </div>
      </div>
    )
  }
}

export default ChatSelector
