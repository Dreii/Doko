import React, { Component } from 'react'

import Header from './Header/Header'
import Body from './Body/Body'
import Inputs from './Inputs/Inputs'

import './Chatroom.css'

class Chatroom extends Component {

  render() {
    let {user, socket, chatroom, value, SetValue, CloseRoom} = this.props

    return (
      <div className={`chat-room ${chatroom ? chatroom.color+" open":""}`}>
        {chatroom ? (
          <div className="chat-room-container">
            <Body chatroom={chatroom} messages={chatroom.messages} user={user} />

            <Inputs
              value={value}
              SetValue={SetValue}

              SendMessage={()=>SendMessage(socket, chatroom, value, user, SetValue)}
            />
            <div className="bottom-gradient"></div>
            
            <Header user={user} chatroom={chatroom} membersCount={chatroom.members.length} membersDisplay={chatroom.membersDisplay} CloseRoom={CloseRoom} />
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

    socket.emit('CLIENT_SENDING_CHAT', profile._id, chatroom._id, value, sendTime)
    SetValue("")
  }
}
