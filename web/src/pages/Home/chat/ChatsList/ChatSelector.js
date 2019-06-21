import React from 'react'
import './ChatsList.css'

import ProfileImg from '../../../../components/display/ProfileImg/ProfileImg'

import Button from '../../../../components/inputs/Button/Button'
import CrownIcon from '../../../../components/display/Icons/CrownIcon'
import TackIcon from '../../../../components/display/Icons/TackIcon'
import TackPinnedIcon from '../../../../components/display/Icons/TackPinnedIcon'

class ChatSelector extends React.PureComponent {

  onClick = () => this.props.ChatClick(this.props.room, this.props.index)

  onPin = (e) => {
    e.stopPropagation()
    this.props.PinRoom(this.props.room._id)
  }

  render() {
    let {room, membersCount, members, selected, pinned} = this.props

    return (
      <div
        className={`chat ${room.ownedByUser ? "owner" : room.creator.color} ${selected ? "active":""}`}
        onClick={this.onClick}
      >
        <h1 className="title">{room.name.length > 22 ? room.name.substr(0, 22)+'...':room.name}</h1>
        <Button
          className={`subscription-button ${(room.ownedByUser || pinned) ? "pinned":""}`}
          svgIcon={room.ownedByUser ? <CrownIcon/> : pinned ? <TackPinnedIcon/>:<TackIcon/>}
          noBack
          onClick={!room.ownedByUser ? this.onPin:undefined}
        />
        <div className="chat-info">
          {room.distance && <p className="distance">{~~room.distance > 0 ? ~~room.distance+'mi':'> 1mi'}</p>}
          <div className="member-list">
            <ProfileImg img={room.creator.image} size={48} className="creator-profile" />
            {membersCount > 3 ? <div className="member-count">{membersCount<100 ? membersCount-3 : "100+"}</div> : null}
            {members.map((member, i) => <ProfileImg key={i} className="member-listing" img={member.image} size={48} />)}
          </div>
        </div>
      </div>
    )
  }
}

export default ChatSelector
