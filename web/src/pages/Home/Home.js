//import react components as needed.
import React, { Component } from 'react'
//import styles for home container.
import './Home.css'

//import all of the main app components,
import HomeUI from './HomeUI/HomeUI'                                      //home button and menu.
import Map from './Map/Map'                                               //Map display.
import ChatsList from './chat/ChatsList/ChatsList'                        //List of chatrooms to select from on the bottom.
import Chatroom from './chat/Chatroom/Chatroom'                           //A full chatroom component.
import CreateRoom from './CreateRoom/CreateRoom'    //A control scheme for creating a room.

//import small global components for basic home functionality,
import Error from '../../components/display/Error/Error'                  //Error display.
import ReactLoading from 'react-loading'                                  //Loading spinner.

//import all neccesary functions and classes,
import API from '../../functions/api'                                     //API class for communication with the server.
import FilterRooms from './functions/FilterRooms'                         //Filter rooms based on a search filter.
import HandleSocket from './functions/HandleSocket'   //Handle any data coming in from sockets.
import {StartTrackingLocation} from './functions/ProcessLocation'//Handle location data.

class Home extends Component {
  state={
    userPosition: null,
    moveCoordinates: null,
    dataReady: false,
    menuOpen: false,
    rooms: [],
    newRooms: false,
    filteredRooms: [],
    createdRooms: [],
    pinnedRooms: [],
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
    placingRoom: false,
    newRoomName: "",
    windowWidth: window.innerWidth
  }

  //when the component is mounted we begin by getting all of the data and connections
  //in that we need in place.
  componentDidMount(){
    //ad a listener to capture window width for certain UI elements.
    window.addEventListener('resize', this.ResizeHandler)

    this.InitiateApp()
  }

  //clena up listeners on unmount
  componentWillUnmount(){window.removeEventListener('resize', this.ResizeHandler)}


  InitiateApp = async () => {
    //get the location of this device, and begin tracking it.
    let location = await StartTrackingLocation.call(this)

    //Make sure the map moves to this new position if it isnt already there.
    this.MoveMap(location)


    //gets a socket from the server, then sets up listeners for all socket events.
    let socket = await HandleSocket.call(this)


    //Set the socket object to state for later requests
    this.setState({socket})


    //download all subscribed rooms and created rooms.
    await this.GetUserSpecificRooms(socket, this.props.user._id)


    //take location data and socket, then make a request for roomdata from the server.
    await this.SearchForNewRooms(socket, location, 12)


    //all of the neccesary pieces of data are in place,
    //we are safe to load the map and place points on it now.
    this.onDataReady()

  }


  //Download all of the rooms this user has created and subscribed to.
  GetUserSpecificRooms = async (socket, userID) => {
    socket.emit("CLIENT_REQUESTING_CREATED", userID)
    socket.emit("CLIENT_REQUESTING_SUBSCRIPTIONS", userID)
  }


  //Make a socket request to the server for room data near a specific
  //coordinate, and for any rooms we created or subscribed to.
  SearchForNewRooms = async (socket, pos, zoom) => {

    //note down the last location that weve searched from.
    this.setState({lastSearchedLocation: pos})

    await API.RequestRooms(
      socket,                                     //socket connection to the server
      this.props.user._id,                        //our ID so the server knows to also grab our created and subscribed rooms.
      pos,                                        //the position to search near.
      zoom,                                       //our maps zoom level, to determine how wide a net to search from the given location.
      this.state.rooms.map(chat => chat._id),     //a list of ID's signifying all of the rooms we already have downloaded, so we can reduce the download.
      this.state.lastDownloadTime                 //The datetime of the last time we downloaded room data(so we can get new messages from after then.)
    )
    //Catch any errors and display them on screen.
    .catch(err => this.HandleError(err.message, 2))

    //once the new data comes in, it will be handled by our socket listeners in HandleSocket.js
  }


  //Capture window width on resize.
  ResizeHandler = (e) => {this.setState({windowX: window.innerWidth})}


  //function to let the rest of the app know when all of our data is ready.
  onMapReady = () => this.setState({mapReady: true})

  //function to let the rest of the app know when the map has loaded.
  onDataReady = () => this.setState({dataReady: true})

  //Function to set new map coordinates.
  MoveMap = (moveCoordinates) => this.setState({moveCoordinates})

  //Set auth to null and take the user back to the login screen.
  Logout = () => {this.props.SetAuth(null)}

  //Toggle the main menu open or closed.
  ToggleMainMenu = (onOff) => this.setState({menuOpen: onOff})

  //Set the input in the chatroom textbox.
  SetChatValue = (val)=>this.setState({chatValue: val})

  //Initiate the UI for placing a new room on the map.
  BeginPlacingRoom = (roomName)=>{this.setState({placingRoom: true, newRoomName: roomName, menuOpen: false})}

  //Cancel room placement and reset new room name to empty.
  CancelPlacingRoom = () => this.setState({placingRoom: false, newRoomName: ""})

  //Returns the component storing the UI for creating a room,
  //this component needs data from inside the map component and
  //the home component.
  CreateRoomUI = (coords) => (
    <CreateRoom
      auth={this.props.auth}
      userID={this.props.user._id}
      socket={this.state.socket}
      coords={coords}
      roomTitle={this.state.newRoomName}
      MoveMap={this.MoveMap}
      HandleError={this.HandleError}
      Close={this.CancelPlacingRoom}
    />
  )


  //Function to select a room from the dataset.
  SelectRoom = (selectedRoom, options) => {

    let {rooms, moveCoordinates} = this.state

    let selectedRoomIndex = 0

    //go through each room in the dataset...
    rooms.forEach((room, i) => {
      //if a room matches our selected room,
      if(room._id === selectedRoom){
        //mark the room as selected, note down the index of this room,
        //and if we should pan the map, set the map move coordinates
        //to the location of this room.
        room.selected = true
        selectedRoomIndex = i
        if(!options || options.dontPan !== true) moveCoordinates = {latitude: room.location[1], longitude: room.location[0]}
      }else{
        //if the room does not match, ensure its not selected.
        room.selected = false
      }
    })

    //Set the new state with the selected room, its index, and the new map coordinates.
    this.setState({selectedRoom, selectedRoomIndex, moveCoordinates})
  }




  //Set the desired room as open, (placing it in the Chatroom component) and make sure
  //the menu is closed.
  OpenRoom = (room) => {this.setState({openedRoom: room, menuOpen: false})}

  //Close the current chatroom, and clear the chat input.
  CloseRoom = () => this.setState({openedRoom: null, chatValue: ""})



  //Filter rooms via a search string, erroring out if no results are found.
  FilterRooms = (val) => {
    let filteredRooms = FilterRooms(val, this.state.rooms)
    this.setState({filteredRooms})

    if(filteredRooms === null) this.HandleError("no results", 0)
  }




  //Pin or unpin a room for the user, adding/removing it from the pinned list on the client and
  //sending a socket request to do the same on the server.
  PinRoom = (roomID) => {
    let {rooms, pinnedRooms, socket} = this.state

    //map through all rooms,
    rooms.map(room => {
      //when the room being pinned/unpinned is found,
      if(room._id === roomID) {
        //toggle the pin state.
        room.pinned = !room.pinned

        //send a request to the server to pin/unpin, dont need a response as we will modify the state
        //on our end.
        socket.emit('CLIENT_PINNING_ROOM', this.props.user._id, room._id, room.pinned)

        //push the pinned room or splice it out of the pinnedRooms array.
        if(room.pinned)
          pinnedRooms.push(room)
        else
          pinnedRooms.splice(pinnedRooms.findIndex(subbedRoom => subbedRoom._id === room._id), 1)
      }
      return room
    })
    this.setState({rooms, pinnedRooms})
  }



  //Delete room function for deleting a room created by the user.
  DeleteRoom = (roomID) => {
    this.state.socket.emit("CLIENT_DELETING_ROOM", this.props.auth, roomID)
  }




  //Set the error string, and level, then begin the shake animation and a timer to stop it.
  HandleError = (errorString, errorLevel) => {
    console.error("error", errorString)
    this.setState({error: errorString, errorShowing: true, errorLevel})

    //begin shake animation timer.
    window.clearTimeout(this.errorFadeTimer)
    this.errorFadeTimer = window.setTimeout(()=>this.setState({errorShowing: false}), 1500)

    //return false incase we want to block form processing.
    return false
  }


  render() {
    let {user, auth} = this.props
    let {
          userPosition, menuOpen, filteredRooms,
          selectedRoomIndex, openedRoom, chatValue, placingRoom,
          error, errorLevel, errorShowing, dataReady, socket, moveCoordinates,
          pinnedRooms, createdRooms, mapReady, windowWidth
        } = this.state

    return (
      <div id="home">

        {/* Display errors */}
        <Error error={error} level={errorLevel} show={errorShowing} />

        {/* if data or map are not ready, show a loading spinner */}
        {!dataReady && !mapReady && (
          <div className="loading-container">
            <ReactLoading type="spin" color="#fff" />
          </div>
        )}

        {/*
          HomeUI component controls the main menu of the app, which includes forms for:
          creating rooms, managing created rooms and pinned rooms,
          searching for geo locations or filtering rooms, and changing user profile data.
        */}
        <HomeUI
          //component specific data / methods.
          open={menuOpen} //whether the menu is open or closed.
          hide={placingRoom || openedRoom!==null || !dataReady || !mapReady} //whether or not to hide the menu.
          SetMenuOpen={this.ToggleMainMenu} //set the menu open or closed.
          windowWidth={windowWidth}

          //authentication and profile data.
          auth={auth} //global auth token for sending a receiving secure requests to the server.
          user={user} //global user object for reading all things pertaining to the user.

          //authentication and profile methods.
          SetAuth={this.props.SetAuth}  //Global function passed down from root to change auth and/or profile.
          Logout={this.Logout} //Sets auth to null, kicking the user to the main menu.

          //room data
          pinnedRooms={pinnedRooms} //a list of all rooms the user has pinned.
          createdRooms={createdRooms} // a list of all rooms the user has created.

          //room methods.
          BeginPlacingRoom={this.BeginPlacingRoom} //Initiate UI to place a new room
          FilterRooms={this.FilterRooms} //Filter rooms and set the new filtered room state
          OpenRoom={this.OpenRoom} //open a room
          PinRoom={this.PinRoom} //pin or unpin a room
          DeleteRoom={this.DeleteRoom} //delete a room

          //Map methods.
          MoveMap={this.MoveMap}  //move the map to new coordinates

          //error handling.
          HandleError={this.HandleError}
        />

        <ChatsList
          //component specific data / methods

          //hide this component if:
          //there is no data for it to show, we are placing a new room,
          //the main menu is open, data is not ready, the map is not ready,
          //or a room is open in the Chatroom component.
          hide={!filteredRooms || placingRoom || menuOpen|| !dataReady || !mapReady || openedRoom !== null}
          windowWidth={windowWidth}

          //user data
          userID={user._id} //the id of the current user, used to determine which rooms are owned by the current user.

          //room data.
          filteredRooms={filteredRooms} //list of rooms, filtered through a room search.
          selectedRoomIndex={selectedRoomIndex} //the array index of the currently selected room, used to move the list scrollbar to the correct position.

          //room methods.
          SelectRoom={this.SelectRoom} // Method to select a room for viewing.
          OpenRoom={this.OpenRoom} // Method to open a room in the Chatroom compnent.
          PinRoom={this.PinRoom} //Method to pin/unpin a room.
        />

        <Chatroom
          //component specific data.
          chatroom={openedRoom} //the current chatroom that is open or null
          value={chatValue} //the value of the users input for typing into chat.

          //component specific methods.
          SetValue={this.SetChatValue} //Method to set the chat input value
          CloseRoom={this.CloseRoom}

          //user data.
          user={user} //the current user, used to label messages sent by the user. and for sending to the server.

          //communication data.
          socket={socket} //the socket object for communication with the server.

          //Room Methods
          PinRoom={this.PinRoom} //Method to pin/unpin a room.
        />

        {/* wait to load the map component until after all data is ready for it. */}
        {dataReady && (
          <Map
            //component specific data
            hide={openedRoom !== null || menuOpen} //hide when a chatroom is open, or when the main menu is open

            //component specific methods
            onMapReady={this.onMapReady} //listener to fire when the map is ready.

            //communication specific data
            socket={socket}

            //map data
            moveCoordinates={moveCoordinates} //a set of coordinates that when changed, prompts the map to move.
            userPosition={userPosition} //the current world coordinates of this device.

            //room data
            filteredRooms={filteredRooms} //list of rooms filtered by a search string.
            placingRoom={placingRoom} //a boolean that tells the map whether or not a new room is being placed.

            //room methods
            SelectRoom={this.SelectRoom} //Select room from dataset.
            OpenRoom={this.OpenRoom} //Open a room in the chatroom
            SearchForNewRooms={this.SearchForNewRooms} //ask the server for rooms near a certain world position.
            CreateRoomUI={this.CreateRoomUI}
          />
        )}
      </div>
    )
  }
}

export default Home
