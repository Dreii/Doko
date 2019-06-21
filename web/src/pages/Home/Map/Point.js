import React from 'react'
import './Point.css'

class Point extends React.PureComponent {

  onClick = () => {
    let {room, OpenRoom, SelectRoom} = this.props
    room.selected ? OpenRoom(room) : SelectRoom(room._id)
  }

  render() {
    const {chatNumber, selected, room} = this.props
    return (
      <div className={`point ${room.ownedByUser ? "owner" : room.creator.color} ${selected ? "selected":""}`} onClick={this.onClick} data-selected={room.selected} data-room={room}>
        <div className="point-background"></div>
        <span className="chat-number">{chatNumber < 100 ? chatNumber : `100+`}</span>
      </div>
    )
  }
}

export default Point
