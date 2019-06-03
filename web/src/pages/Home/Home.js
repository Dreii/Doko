import React, { Component } from 'react'
import './Home.css'
import HomeUI from '../../components/HomeUI/HomeUI'
import Map from '../../components/Map/Map'
import ChatsList from '../../components/ChatsList/ChatsList'
import Chatroom from '../../components/Chatroom/Chatroom'
import ReactLoading from 'react-loading'
import ChooseRoom from './functions/ChooseRoom'
import FilterChatData from './functions/FilterChatData'
import HandleError from './functions/HandleError'
import ProcessSocketTransfers from './functions/ProcessSocketTransfers'
import {GetInitialLocation} from './functions/ProcessLocation'
import API from '../../functions/api'

class Home extends Component {
  state={
    userPosition: null,
    viewPosition: null,
    mapReady: false,
    uiReady: false,
    menuOpen: false,
    chatData: [],
    filteredChatData: [],
    selectedRoom: 0,
    openRoom: null,
    searchOpen: false,
    searchString: "",
    chatValue: "",
    error: "",
    errorLevel: 0,
    socket: null
  }

  componentDidMount(){

    GetInitialLocation()
    .then(position => {
      let userPosition = {}
      userPosition.latitude = position.coords.latitude
      userPosition.longitude = position.coords.longitude

      this.setState({userPosition, viewPosition: userPosition, mapReady: true})
      setTimeout(()=>this.setState({uiReady: true}), 1500)

      ProcessSocketTransfers.call(this)
      .then(socket => {
        this.setState({socket})
        API.RequestRooms(socket, userPosition, userPosition, this.state.chatData.map(chat => chat._id))
      })

    })
    .catch(err => {
      console.log(err)
      HandleError.call(this, err.message, 0)
      let defaultPos = {latitude: 30.2671537, longitude: -97.743057}
      this.setState({viewPosition: defaultPos, mapReady: true})
      setTimeout(()=>this.setState({uiReady: true}), 1500)

      ProcessSocketTransfers.call(this)
      .then(socket => {
        console.log("got initial socket error")
        API.RequestRooms(socket, null, defaultPos, this.state.chatData.map(chat => chat._id))
      })
    })
  }

  render() {
    let {user, SetAuth} = this.props
    let {
          userPosition, viewPosition, menuOpen, chatData, filteredChatData,
          selectedRoom, openRoom, searchOpen, searchString, chatValue,
          error, errorLevel, uiReady, socket
        } = this.state

    return (
      <div id="home">
        <div className="loading-container">
          <ReactLoading type="spin" color="#fff" />
        </div>

        <HomeUI
          user={user}
          openRoom={openRoom}
          searchString={searchString}
          toggleSearchOpen={()=>this.setState({searchOpen: !searchOpen, searchString:"", filteredChatData: this.state.chatData, selectedRoom: 0})}
          searchOpen={searchOpen}
          menuOpen={menuOpen}
          toggleMenuOpen={()=>this.setState({menuOpen: !menuOpen})}
          setSearchString={(val)=>{
            let filteredChatData = FilterChatData(val, chatData)
            this.setState({searchString: val, filteredChatData, selectedRoom: 0})
          }}
          SetAuth={SetAuth}
          error={error}
          errorLevel={errorLevel}
          uiReady={uiReady}
        />

        <ChatsList
          chatData={chatData}
          filteredChatData={filteredChatData}
          selectedRoom={selectedRoom}
          ScrollChatSelector={(dir)=>this.setState({
            selectedRoom: Math.min(filteredChatData.length-1, Math.max(0, selectedRoom+dir))
          })}
          selectRoom={(roomID)=>this.setState({selectedRoom: ChooseRoom.call(this, roomID)})}
          openRoom={(roomID)=>this.setState({openRoom: ChooseRoom.call(this, roomID), menuOpen: false, searchOpen: false})}
          roomOpen={openRoom !== null}
          uiReady={uiReady}
        />

        <Chatroom
          user={user}
          chatroom={openRoom!==null ? chatData[openRoom]:null}
          SetRoomData={(newRoomData)=>{
            let chatData = this.state.chatData
            chatData[newRoomData._id] = newRoomData
            this.setState({chatData: chatData})
          }}
          value={chatValue}
          SetValue={(val)=>this.setState({chatValue: val})}
          CloseRoom={()=>this.setState({openRoom: null})}
        />

        {viewPosition && (
          <Map
            userPosition={userPosition}
            viewPosition={viewPosition}
            chatData={chatData}
            filteredChatData={filteredChatData}
            selectedRoom={selectedRoom}
            selectRoom={(roomID)=>this.setState({selectedRoom: ChooseRoom.call(this, roomID)})}
            openRoom={(roomID)=>this.setState({openRoom: ChooseRoom.call(this, roomID)})}
            roomOpen={openRoom !== null}
            setError={(error, errorLevel)=>HandleError.call(this, error, errorLevel)}
            SearchChats={(viewPosition)=>socket && API.RequestRooms(socket, userPosition, viewPosition, this.state.chatData.map(chat => chat._id))}
          />
        )}
      </div>
    )
  }
}

export default Home
