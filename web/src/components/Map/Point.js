import React from 'react'
import './Point.css'

class Point extends React.PureComponent {

  onClick = () => {
    let {room, OpenRoom, SelectRoom} = this.props
    room.selected ? OpenRoom(room) : SelectRoom(room._id)
  }

  render() {
    console.log("point render")
    const {color, onClick, chatNumber, selected, room} = this.props
    return (
      <div className={`point ${color} ${selected ? "selected":""}`} onClick={this.onClick} data-selected={selected} data-room={room}>
        <div className="point-background"></div>
        <span className="chat-number">{chatNumber < 100 ? chatNumber : `100+`}</span>
      </div>
    )
  }
}

export default Point
