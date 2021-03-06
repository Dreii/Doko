import React, { Component } from 'react'
import './ChatsList.css'

import ChatSelector from './ChatSelector'

class ChatsList extends Component {

  componentDidUpdate(prevProps){
    let {selectedRoomIndex} = this.props
    if(prevProps.selectedRoomIndex !== selectedRoomIndex){
      this.chats.scrollLeft = (selectedRoomIndex*(308+64))
    }
  }

  ChatClick = (room, i) => {
    room.selected ? this.props.OpenRoom(room):this.props.SelectRoom(room._id)
  }

  DisplayRooms = () => {
    let {filteredRooms, PinRoom} = this.props
    if(filteredRooms)
    return filteredRooms.map((room, i) => {
      return (
          <ChatSelector
            room={room}
            selected={room.selected}
            pinned={room.pinned}
            index={i}
            key={room._id}
            members={room.members}
            membersCount={room.membersCount}

            ChatClick={this.ChatClick}
            PinRoom={PinRoom}
          />
      )
    })
  }

  render() {
    let {hide} = this.props
    return (
      <div className={`chats ${hide ? "hide":""}`} ref={elem => this.chats = elem}>
        {this.DisplayRooms()}
      </div>
    )
  }
}

export default ChatsList
