import React, { Component } from 'react'
import './ChatsList.css'

import ProfileImg from '../ProfileImg/ProfileImg'

class ChatsList extends Component {

  componentDidMount(){
    this.chats.addEventListener('wheel', this.handleChatScroll.bind(this))
    window.addEventListener('keydown', this.handleDirectionKeys.bind(this))
    this.scrollReady = true
    this.resetScroll = null
  }

  handleChatScroll(e){
    if(this.scrollReady){
      let dir
      if(e.deltaX > 0) dir = 1
      else if(e.deltaX < 0) dir = -1

      this.props.ScrollChatSelector(dir)
      this.scrollReady = false;
      this.resetScroll = window.setTimeout(()=>this.scrollReady = true, 1500)
    }
  }

  handleDirectionKeys(e){
    let dir = 0
    if(e.key === "ArrowRight") dir = 1
    if(e.key === "ArrowLeft") dir = -1

    if(dir !== 0) this.props.ScrollChatSelector(dir)
  }

  componentWillUnmount(){
    this.chats.removeEventListener('wheel', this.handleChatScroll.bind(this))
    window.clearTimeout(this.resetScroll)
  }

  render() {
    let {filteredChatData, selectedRoom, selectRoom, openRoom, roomOpen, uiReady} = this.props
    let selectedRoomData = filteredChatData[selectedRoom]
    return (
      <div className={`chats ${roomOpen||!uiReady ? "hide":""}`} ref={elem => this.chats = elem}>
        {filteredChatData!== null ? filteredChatData.map((chatroom, i) => {
          let active = selectedRoomData && selectedRoomData._id === chatroom._id
          return (
            <ChatSelector
              key={chatroom._id}
              chatroom={chatroom}
              active={active}
              style={i===0?{marginLeft: -(selectedRoom*(308+64))+32}:null}
              onClick={() => active ? openRoom(chatroom._id):selectRoom(chatroom._id)}
            />
          )
      }):null}
      </div>
    )
  }
}

export default ChatsList

const ChatSelector = ({chatroom, hide, active, style, onClick}) => (
  <div
    className={`chat ${chatroom.color} ${active ? "active":""} ${hide?"hide":""}`}
    style={style}
    onClick={onClick}
  >
    <h1 className="title">{chatroom.name.length > 40 ? chatroom.name.substr(0, 40)+'...':chatroom.name}</h1>
    <div className="chat-info">
      <p className="distance">{~~chatroom.distance > 0 ? ~~chatroom.distance+'mi':'> 1mi'}</p>
      <div className="member-list">
        <ProfileImg img={chatroom.creator.image} size={48} className="creator-profile" />
        {chatroom.members.length > 3 ? <div className="member-count">{chatroom.members.length<100 ? chatroom.members.length-3 : "100+"}</div> : null}
        {chatroom.members.map((member, i) => (i >= chatroom.members.length-3) ? <ProfileImg key={i} className="member-listing" img={member.image} size={48} />:null)}
      </div>
    </div>
  </div>
)
