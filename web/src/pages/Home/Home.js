import React, { Component } from 'react'
import './Home.css'
import HomeUI from '../../components/inputs/HomeUI/HomeUI'
import Map from '../../components/Map/Map'
import ChatsList from '../../components/chat/ChatsList/ChatsList'
import Chatroom from '../../components/chat/Chatroom/Chatroom'
import Error from '../../components/display/Error/Error'

import CreateRoom from '../../components/inputs/CreateRoom/CreateRoom'

import API from '../../functions/api'
import ReactLoading from 'react-loading'

import FilterRooms from './functions/FilterRooms'
import HandleError from './functions/HandleError'
import ProcessSocketTransfers from './functions/ProcessSocketTransfers'
import {GetInitialLocation, WatchLocation} from './functions/ProcessLocation'


class Home extends Component {
  state={
    userPosition: null,
    viewPosition: null,
    moveCoordinates: null,
    uiReady: false,
    menuOpen: false,
    rooms: [],
    newRooms: false,
    filteredRooms: [],
    createdRooms: [],
    subscribedRooms: [],
    messages: [],
    lastDownloadTime: null,
    selectedRoomIndex: 0,
    selectedRoom: null,
    openedRoom: null,
    searchString: "",
    chatValue: "",
    error: "",
    errorLevel: 0,
    errorShowing: false,
    socket: null,
    // searchPosition: null,
    placingRoom: false,
    newRoom: ""
  }

  componentDidMount(){
    GetInitialLocation()
    .then(position => {
      let userPosition = {}
      userPosition.latitude = position.coords.latitude
      userPosition.longitude = position.coords.longitude

      this.setState({userPosition, viewPosition: userPosition})
      setTimeout(()=>this.setState({uiReady: true}), 1500)

      ProcessSocketTransfers.call(this)
      .then(socket => {
        console.log(socket.id)
        this.setState({socket})
        API.RequestRooms(socket, this.props.user._id, userPosition, 12, this.state.rooms.map(chat => chat._id), this.state.lastDownloadTime)
      })

      WatchLocation.bind(this)
    })
    .catch(err => {
      console.log(err)
      HandleError.call(this, err.message, 0)
      let defaultPos = {latitude: 30.2671537, longitude: -97.743057}
      this.setState({viewPosition: defaultPos})
      setTimeout(()=>this.setState({uiReady: true}), 1500)

      ProcessSocketTransfers.call(this)
      .then(socket => {
        console.log("got initial socket error")
        API.RequestRooms(socket, this.props.user._id, defaultPos, 12, this.state.rooms.map(chat => chat._id), this.state.lastDownloadTime)
      })
    })
  }

  componentDidUpdate(prevProps, prevState){
    let {newRooms, searchString, rooms} = this.state
    let {user} = this.props

    if(newRooms === true && prevState.newRooms === false){
      console.log("should update")
      this.setState({
        filteredRooms: FilterRooms(searchString, rooms),
        createdRooms: rooms.filter(room => room.creator._id === user._id),
        subscribedRooms: rooms.filter(room => {
          if(user.subscriptions.includes(room._id)){
            room.pinned = true
            return true
          }
        }),
        newRooms: false,
      })
    }
  }

  //Set the error string, and level, then begin the shake animation and a timer to stop it.
  SetError = (errorString, errorLevel) => {
    console.log("error", errorString)
    this.setState({error: errorString, errorShowing: true, errorLevel})

    //begin shake animation timer.
    window.clearTimeout(this.errorFadeTimer)
    this.errorFadeTimer = window.setTimeout(()=>this.setState({errorShowing: false}), 1500)

    //return false so that we can block form processing (check ValidateForm function).
    return false
  }

  SearchForNewRooms = (viewPosition, zoom) => {
    if(this.state.socket)
      API.RequestRooms(
        this.state.socket,
        this.props.user._id,
        viewPosition,
        zoom,
        this.state.rooms.map(chat => chat._id),
        this.state.lastDownloadTime
      )

    this.setState({viewPosition})
  }

  SelectRoom = (selectedRoom) => {
    let {rooms, moveCoordinates} = this.state

    let selectedRoomIndex = 0
    rooms.forEach((room, i) => {
      if(room._id === selectedRoom){
        room.selected = true
        selectedRoomIndex = i
        moveCoordinates = {latitude: room.location[1], longitude: room.location[0]}
      }else{
        room.selected = false
      }
    })


    this.setState({selectedRoom, selectedRoomIndex, moveCoordinates})
  }

  OpenRoom = (room) => {this.setState({openedRoom: room, menuOpen: false})}

  FilterRooms = (val) => {
    let filteredRooms = FilterRooms(val, this.state.rooms)
    this.setState({filteredRooms})

    if(filteredRooms === null) this.SetError("no results", 0)
  }


  PinRoom = (roomID) => {
    console.log("pinning", roomID)
    let {rooms, subscribedRooms, socket} = this.state
    rooms.map(room => {
      if(room._id === roomID) {
        room.pinned = !room.pinned

        socket.emit('CLIENT_PINNING_ROOM', this.props.user._id, room._id, room.pinned)

        if(room.pinned)
          subscribedRooms.push(room)
        else
          subscribedRooms.splice(subscribedRooms.findIndex(subbedRoom => subbedRoom._id === room._id), 1)
      }
      return room
    })
    this.setState({rooms, subscribedRooms})
  }

  DeleteRoom = (roomID) => {
    console.log(roomID)
  }

  MoveMap = (moveCoordinates) => this.setState({moveCoordinates})

  render() {
    let {user, auth, SetAuth} = this.props
    let {
          userPosition, viewPosition, menuOpen, rooms, filteredRooms,
          selectedRoomIndex, openedRoom, searchString, chatValue, placingRoom, newRoom,
          messages, error, errorLevel, errorShowing, uiReady, socket, moveCoordinates,
          subscribedRooms, createdRooms
        } = this.state

    return (
      <div id="home">
        <Error error={error} level={errorLevel} show={errorShowing} />
        <div className="loading-container">
          <ReactLoading type="spin" color="#fff" />
        </div>

        <HomeUI
          auth={auth}
          user={user}
          SetAuth={(auth, user)=>SetAuth(auth, user)}
          hide={placingRoom || openedRoom!==null || !uiReady}
          SetFilteredRooms={this.FilterRooms}
          CreateRoom={(name)=>{this.setState({placingRoom: true, newRoom: name, menuOpen: false})}}
          OpenRoom={this.OpenRoom}
          MoveMap={this.MoveMap}
          open={menuOpen}
          PinRoom={this.PinRoom}
          DeleteRoom={this.DeleteRoom}
          SetMenuOpen={(onOff) => this.setState({menuOpen: onOff})}
          Logout={()=>SetAuth(null)}
          HandleError={(err, level) => this.SetError(err, level)}

          subscribedRooms={subscribedRooms}
          createdRooms={createdRooms}
        />

        <ChatsList
          hide={!filteredRooms || placingRoom || menuOpen||!uiReady||openedRoom !== null}
          rooms={rooms}
          messages={messages}
          filteredRooms={filteredRooms}
          selectedRoomIndex={selectedRoomIndex}
          ScrollChatSelector={this.ScrollRoom}
          selectRoom={this.SelectRoom}
          OpenRoom={this.OpenRoom}
          uiReady={uiReady}
          PinRoom={this.PinRoom}
          userID={user._id}
        />

        <Chatroom
          user={user}
          socket={socket}
          chatroom={openedRoom}
          value={chatValue}
          SetValue={(val)=>this.setState({chatValue: val})}
          CloseRoom={()=>this.setState({openedRoom: null, chatValue: ""})}
        />

        {viewPosition && (
          <Map
            moveCoordinates={moveCoordinates}
            userPosition={userPosition}
            viewPosition={viewPosition}
            // searchPosition={searchPosition}//maybe can be replaced with one set map func
            rooms={rooms}
            filteredRooms={filteredRooms}
            messages={messages}
            selectedRoomIndex={selectedRoomIndex}
            SelectRoom={this.SelectRoom}
            OpenRoom={this.OpenRoom}
            hide={openedRoom !== null || menuOpen}
            SearchForNewRooms={this.SearchForNewRooms}
            placingRoom={placingRoom}
            CreateRoom = {(coords) => (
              <CreateRoom
                auth={auth}
                userID={user._id}
                socket={socket}
                coords={coords}
                roomTitle={newRoom}
                SetSearchCoords={(coords)=>this.setState({searchPosition: coords})}
                HandleError={(err, level) => this.SetError(err, level)}
                Close={() => this.setState({placingRoom: false, newRoom: ""})}
              />
            )}
          />
        )}
      </div>
    )
  }
}

export default Home
