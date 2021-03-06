import React from 'react'
import ProfileImg from '../../../../../components/display/ProfileImg/ProfileImg'

import './Body.css'

const Body = ({chatroom, messages, user}) => (
  <div className="chat-body">
    {
      messages.length > 0 ? (
        messages.map((message, i) => (
          message.sender !== null && message.sender._id === user._id ?
          <UserSentMessage message={message} key={i}/>:<Message chatroom={chatroom} message={message} key={i}/>
        ))
      ): <p className="no-messages">Nobody here but us chickens.</p>
    }
    <div className="chat-body-spacer"></div>
  </div>
)

export default Body

function Message({chatroom, message}){
  console.log(chatroom, message)
  let color = (message.sender && message.sender._id === chatroom.creator._id) ? chatroom.creator.color : message.color

  return(
    <div className={`chat-message ${color} ${message.sender ? "": "missing-user"}`}>
      <ProfileImg className="chat-message-sender" img={message.sender ? message.sender.image : '/user-missing-icon.svg'} size={28} />
      <p className="chat-message-text">
        <span className="chat-message-name">{message.sender ? message.sender.name : "Deleted User"}</span>
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
