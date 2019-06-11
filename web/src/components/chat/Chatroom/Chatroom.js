import React, { Component } from 'react'

import Header from './Header/Header'
import Body from './Body/Body'
import Inputs from './Inputs/Inputs'

import './Chatroom.css'

class Chatroom extends Component {

  render() {
    let {user, socket, chatroom, messages, value, SetValue, CloseRoom} = this.props

    let members = []
    messages.forEach(message => {
      if(members.find(member => member._id === message.sender._id)) return
      members.push(message.sender)
    })

    let membersDisplay = members.slice(0, 3).reverse()

    return (
      <div className={`chat-room ${chatroom ? chatroom.color+" open":""}`}>
        {chatroom ? (
          <div className="chat-room-container">
            <Header user={user} chatroom={chatroom} membersCount={members.length} membersDisplay={membersDisplay} CloseRoom={CloseRoom} />

            <Body chatroom={chatroom} messages={messages} user={user} />

            <Inputs
              value={value}
              SetValue={SetValue}

              SendMessage={()=>SendMessage(socket, chatroom, value, user, SetValue)}
            />
          </div>
        ):null}
      </div>
    )
  }

}

export default Chatroom

function SendMessage(socket, chatroom, value, profile, SetValue){
  let sendTime = new Date().toISOString()
  SetValue("")

  socket.emit('CLIENT_SENDING_CHAT', profile._id, chatroom._id, value, sendTime)
}
