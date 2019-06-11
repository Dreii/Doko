import React, { Component } from 'react'
import './Home.css'
import HomeUI from '../../components/inputs/HomeUI/HomeUI'
import Map from '../../components/Map/Map'
import ChatsList from '../../components/chat/ChatsList/ChatsList'
import Chatroom from '../../components/chat/Chatroom/Chatroom'

import API from '../../functions/api'
import ReactLoading from 'react-loading'

import ChooseRoom from './functions/ChooseRoom'
import FilterRooms from './functions/FilterRooms'
import HandleError from './functions/HandleError'
import ProcessSocketTransfers from './functions/ProcessSocketTransfers'
import {GetInitialLocation} from './functions/ProcessLocation'


class Home extends Component {
  state={
    userPosition: null,
    viewPosition: null,
    mapReady: false,
    uiReady: false,
    menuOpen: false,
    rooms: [],
    filteredRooms: [],
    messages: [],
    lastDownloadTime: null,
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
        API.RequestRooms(socket, userPosition, userPosition, 12, this.state.rooms.map(chat => chat._id), this.state.lastDownloadTime)
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
        API.RequestRooms(socket, null, defaultPos, 12, this.state.rooms.map(chat => chat._id), this.state.lastDownloadTime)
      })
    })
  }

  render() {
    let {user, SetAuth} = this.props
    let {
          userPosition, viewPosition, menuOpen, rooms, filteredRooms,
          selectedRoom, openRoom, searchOpen, searchString, chatValue,
          messages, error, errorLevel, uiReady, socket
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
          toggleSearchOpen={()=>this.setState({searchOpen: !searchOpen, searchString:"", filteredRooms: this.state.rooms, selectedRoom: 0})}
          searchOpen={searchOpen}
          menuOpen={menuOpen}
          toggleMenuOpen={()=>this.setState({menuOpen: !menuOpen})}
          setSearchString={(val)=>{
            let filteredRooms = FilterRooms(val, rooms)
            this.setState({searchString: val, filteredRooms, selectedRoom: 0})
          }}
          SetAuth={SetAuth}
          error={error}
          errorLevel={errorLevel}
          uiReady={uiReady}
        />

        <ChatsList
          rooms={rooms}
          messages={messages}
          filteredRooms={filteredRooms}
          selectedRoom={selectedRoom}
          ScrollChatSelector={(dir)=>this.setState({
            selectedRoom: Math.min(filteredRooms.length-1, Math.max(0, selectedRoom+dir))
          })}
          selectRoom={(roomID)=>this.setState({selectedRoom: ChooseRoom.call(this, roomID)})}
          openRoom={(roomID)=>this.setState({openRoom: ChooseRoom.call(this, roomID), menuOpen: false, searchOpen: false})}
          roomOpen={openRoom !== null}
          uiReady={uiReady}
        />

        <Chatroom
          user={user}
          socket={socket}
          chatroom={openRoom!==null ? rooms[openRoom]:null}
          messages={messages.filter(message => openRoom!==null ? rooms[openRoom]._id === message.room:[])}
          value={chatValue}
          SetValue={(val)=>this.setState({chatValue: val})}
          CloseRoom={()=>this.setState({openRoom: null, chatValue: ""})}
        />

        {viewPosition && (
          <Map
            userPosition={userPosition}
            viewPosition={viewPosition}
            rooms={rooms}
            filteredRooms={filteredRooms}
            messages={messages}
            selectedRoom={selectedRoom}
            selectRoom={(roomID)=>this.setState({selectedRoom: ChooseRoom.call(this, roomID)})}
            openRoom={(roomID)=>this.setState({openRoom: ChooseRoom.call(this, roomID)})}
            roomOpen={openRoom !== null}
            setError={(error, errorLevel)=>HandleError.call(this, error, errorLevel)}
            SearchChats={(viewPosition, zoom)=>socket && API.RequestRooms(socket, userPosition, viewPosition, zoom, this.state.rooms.map(chat => chat._id), this.state.lastDownloadTime)}
          />
        )}
      </div>
    )
  }
}

export default Home
