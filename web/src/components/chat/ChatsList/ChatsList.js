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
    room.selected ? this.props.OpenRoom(room):this.props.selectRoom(room._id)
  }

  DisplayRooms = () => {
    let {filteredRooms, messages, selectRoom, OpenRoom, PinRoom, userID} = this.props
    if(filteredRooms)
    return filteredRooms.map((room, i) => {
      return (
        <ChatSelector
          key={room._id}
          room={room}
          membersCount={room.membersCount}
          memberDisplay={room.membersDisplay}
          messages={room.messages}
          active={room.selected}
          PinRoom={PinRoom}
          pinned={room.pinned}
          index={i}
          onClick={this.ChatClick}
          ownedByUser={room.creator._id === userID}
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
