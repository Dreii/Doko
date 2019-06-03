import React, { Component } from 'react'

import Header from './Header/Header'
import Body from './Body/Body'
import Inputs from './Inputs/Inputs'

import './Chatroom.css'

class Chatroom extends Component {

  render() {
    let {user, chatroom, SetRoomData, value, SetValue, CloseRoom} = this.props

    return (
      <div className={`chat-room ${chatroom ? chatroom.color+" open":""}`}>
        {chatroom ? (
          <div className="chat-room-container">
            <Header user={user} chatroom={chatroom} CloseRoom={CloseRoom} />

            <Body chatroom={chatroom} user={user} />

            <Inputs
              value={value}
              SetValue={SetValue}

              SendMessage={()=>SendMessage(chatroom, value, user, SetRoomData, SetValue)}
            />
          </div>
        ):null}
      </div>
    )
  }

}

export default Chatroom

function SendMessage(room, value, profile, SetRoomData, SetValue){
  room.history.unshift({message: value, sender: profile})
  SetValue("")
  SetRoomData(room)
}
