import API from '../../../functions/api'
import HandleNewRooms from './HandleNewRooms'
import HandleNewMessage from './HandleNewMessage'

//This function aquires a socket from the server and then opens up listeners for it.
export default function HandleSocket(){
  //Connect socket and return it.
  return API.ConnectSocket(this.props.user)
  //Then we set up all of the socket listeners for the app.
  .then(socket => {

    //When the server is sending new rooms we need to
    //format them for display on the client, and add them to the proper lists.
    socket.on('SERVER_SENDING_ROOM_DATA', (newRooms) => {
      HandleNewRooms.call(this, newRooms)
    })

    //When we first log in, we will request all rooms created by this user.
    socket.on('SERVER_SENDING_CREATED_ROOMS', (createdRooms) => {
      this.setState({createdRooms})
    })

    //When we first log in, we will request all rooms pinned by this user.
    socket.on('SERVER_SENDING_PINNED_ROOMS', (pinnedRooms) => {
      this.setState({pinnedRooms})
    })


    //when a new room is created, we add it to our created rooms and afterwards we open it.
    socket.on('ROOM_CREATED', (newRoom) => {
      let {createdRooms} = this.state

      //set the new room as owned by user, then add it to created rooms.
      newRoom.ownedByUser = true
      createdRooms.push(newRoom)
      //also set the new search location to the rooms coordinates so that we sort the rooms by distance correctly.
      this.setState({createdRooms, lastSearchedLocation: {latitude: newRoom.location[1], longitude: newRoom.location[0]}})

      //after weve added it to the created room list,
      //we should add it to the normal room queue as the map is
      //focused on this point.
      HandleNewRooms.call(this, [newRoom])

      //select and open this new room.
      this.OpenRoom(newRoom)
    })

    //tbd...
    socket.on('ROOM_DELETED', roomID => {
      let {rooms, filteredRooms, createdRooms, pinnedRooms, openedRoom} = this.state

      //if this room is currently open, close it.
      if(openedRoom && openedRoom._id === roomID){
        this.HandleError("Room closed by owner.", 0)
        openedRoom = null
      }

      //filter out any instances of the deleted room from all room collections.
      rooms = rooms.filter(room => room._id !== roomID)
      filteredRooms = filteredRooms.filter(room => room._id !== roomID)
      createdRooms = createdRooms.filter(room => room._id !== roomID)
      pinnedRooms = pinnedRooms.filter(room => room._id !== roomID)

      this.setState({rooms, filteredRooms, createdRooms, pinnedRooms, openedRoom})
    })

    //when a new message comes in,
    socket.on('NEW_MESSAGE', newMessageData => {
      //Add it to the proper room collections
      HandleNewMessage.call(this, newMessageData)
    })

    return socket
  })
}
