import React from 'react'
import {GenerateRandomColor} from '../../../functions/helpers'
import ProfileImg from '../../ProfileImg/ProfileImg'

import './Body.css'

const Body = ({chatroom, user}) => (
  <div className="chat-body">
    {
      chatroom.history.map((message, i) => (
        message.sender._id === user._id ?
        <UserSentMessage message={message} key={i}/>:<Message chatroom={chatroom} message={message} key={i}/>
      ))
    }
    <div className="chat-body-spacer"></div>
  </div>
)

export default Body

function Message({chatroom, message}){
  let randomSeed = Math.abs(HashCode(message.sender.firstName+message.sender.lastName))
  let color = (message.sender._id === chatroom.creator._id) ?
  (chatroom.color):(GenerateRandomColor(randomSeed, chatroom.color))

  return(
    <div className={`chat-message ${color}`}>
      <ProfileImg className="chat-message-sender" img={message.sender.image} size={28} />
      <p className="chat-message-text">
        <span className="chat-message-name">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
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

function HashCode(string) {
  var hash = 0, i, chr, len;
  if (string.length === 0) return hash;
  for (i = 0, len = string.length; i < len; i++) {
    chr   = string.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
