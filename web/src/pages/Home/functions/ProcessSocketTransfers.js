import API from '../../../functions/api'
import {GenerateRandomColor, HashCode} from '../../../functions/helpers'
import SortRooms from './SortRooms'
import AssimilateNewRoomData from './AssimilateNewRoomData'


export default function ProcessSocketTransfers(){
  return API.ConnectSocket(this.props.user)
  .then(socket => {

    socket.on('SERVER_SENDING_ROOM_DATA', (newRooms, newMessages) => {
      let {messages, rooms, searchString, userPosition, selectedRoom} = this.state
      let {user} = this.props

      if(newMessages.length > 0){
        newMessages.forEach(message => {
          message.color = message.sender !== null ? GenerateRandomColor(HashCode(message.sender._id.toString())) : ""
        })
        messages.push(...newMessages)
      }

      if(newRooms.length > 0){
        AssimilateNewRoomData.call(this, newRooms, selectedRoom)
        if(!selectedRoom) rooms[0].selected = true
      }

      this.setState({rooms, messages, newRooms: true, lastDownloadTime: Date.now()})
    })

    socket.on('ROOM_CREATED', (newRoom) => {
      let rooms = AssimilateNewRoomData.call(this, newRoom, newRoom._id)
      this.setState({rooms, selectedRoom: newRoom._id, newRooms: true})
    })

    socket.on('ROOM_DELETED_NEARBY', roomID => {
      console.log(roomID)
    })

    socket.on('NEW_MESSAGE', newMessage => {
      console.log("new message")
      let rooms = this.state.rooms
      let room = rooms.find(room => room._id === newMessage.room)
      if(room) room.messages.unshift(newMessage)

      this.setState({messages: [newMessage, ...this.state.messages]})
    })

    return socket
  })
}
