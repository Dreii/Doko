import React from 'react'
import {GenerateRandomColor, HashCode} from '../../../../functions/helpers'
import ProfileImg from '../../../display/ProfileImg/ProfileImg'

import './Body.css'

const Body = ({chatroom, messages, user}) => (
  <div className="chat-body">
    {
      messages.map((message, i) => (
        message.sender._id === user._id ?
        <UserSentMessage message={message} key={i}/>:<Message chatroom={chatroom} message={message} key={i}/>
      ))
    }
    <div className="chat-body-spacer"></div>
  </div>
)

export default Body

function Message({chatroom, message}){
  let randomSeed = Math.abs(HashCode(message.sender.name))
  let color = (message.sender._id === chatroom.creator._id) ?
  (chatroom.color):(GenerateRandomColor(randomSeed, chatroom.color))

  return(
    <div className={`chat-message ${color}`}>
      <ProfileImg className="chat-message-sender" img={message.sender.image} size={28} />
      <p className="chat-message-text">
        <span className="chat-message-name">{message.sender.name}</span>
        {message.message}
      </p>
    </div>
  )
}

function UserSentMessage({message}){
  return(
    <div className={`chat-message user-sent`}>
      <p className="chat-message-text">
        <span className="chat-message-name">You</span>
        {message.message}
      </p>
    </div>
  )
}
