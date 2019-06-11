import React, { Component } from 'react'
import './ChatsList.css'

import ProfileImg from '../../display/ProfileImg/ProfileImg'

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
    let {filteredRooms, messages, selectedRoom, selectRoom, openRoom, roomOpen, uiReady} = this.props
    let selectedRoomData = filteredRooms[selectedRoom]
    return (
      <div className={`chats ${roomOpen||!uiReady ? "hide":""}`} ref={elem => this.chats = elem}>
        {filteredRooms!== null ? filteredRooms.map((room, i) => {
          let active = selectedRoomData && selectedRoomData._id === room._id
          let chatsMessages = messages.filter(message => message.room === room._id)

          let chatsMembers = []
          chatsMessages.forEach(message => {
            if(chatsMembers.find(member => member._id === message.sender._id)) return
            chatsMembers.push(message.sender)
          })

          let memberDisplay = chatsMembers.slice(0, 3).reverse()

          return (
            <ChatSelector
              key={room._id}
              room={room}
              membersCount={chatsMembers.length}
              memberDisplay={memberDisplay}
              messages={chatsMessages}
              active={active}
              style={i===0 ? {marginLeft: -(selectedRoom*(308+64))+32} : null}
              onClick={() => active ? openRoom(room._id):selectRoom(room._id)}
            />
          )
      }):null}
      </div>
    )
  }
}

export default ChatsList

const ChatSelector = ({room, membersCount, memberDisplay, messages, active, style, onClick}) => (
  <div
    className={`chat ${room.color} ${active ? "active":""}`}
    style={style}
    onClick={onClick}
  >
    <h1 className="title">{room.name.length > 40 ? room.name.substr(0, 40)+'...':room.name}</h1>
    <div className="chat-info">
      <p className="distance">{~~room.distance > 0 ? ~~room.distance+'mi':'> 1mi'}</p>
      <div className="member-list">
        <ProfileImg img={room.creator.image} size={48} className="creator-profile" />
        {membersCount > 3 ? <div className="member-count">{membersCount<100 ? membersCount-3 : "100+"}</div> : null}
        {memberDisplay.map((member, i) => <ProfileImg key={i} className="member-listing" img={member.image} size={48} />)}
      </div>
    </div>
  </div>
)
