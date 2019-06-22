import React, { Component } from 'react'

import Header from './Header/Header'
import Body from './Body/Body'
import Inputs from './Inputs/Inputs'

import './Chatroom.css'

class Chatroom extends Component {

  onPin = (e) => {
    this.props.PinRoom(this.props.chatroom._id)
  }

  render() {
    let {user, socket, chatroom, value, SetValue, CloseRoom} = this.props

    return (
      <div className={`chat-room ${chatroom ? "open" : ""} ${chatroom ? (chatroom.ownedByUser ? "owner" : chatroom.creator.color):""}`}>
        {chatroom ? (
          <div className="chat-room-container">
            <Body chatroom={chatroom} messages={chatroom.messages} user={user} />

            <Inputs
              value={value}
              SetValue={SetValue}

              SendMessage={()=>SendMessage(socket, chatroom, value, user, SetValue)}
            />
            <div className="bottom-gradient"></div>

            <Header
              user={user}
              chatroom={chatroom}

              CloseRoom={CloseRoom}
              onPin={this.onPin}
            />
          </div>
        ):null}
      </div>
    )
  }

}

export default Chatroom

function SendMessage(socket, chatroom, value, profile, SetValue){
  if(value !== ""){
    let sendTime = new Date().toISOString()

    socket.emit('CLIENT_SENDING_CHAT', profile._id, chatroom._id, chatroom.creator.color, (chatroom.creator._id === profile._id), value, sendTime)
    SetValue("")
  }
}
