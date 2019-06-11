import API from '../../../functions/api'
import {GenerateRandomColor, HashCode} from '../../../functions/helpers'
import FilterRooms from './FilterRooms'

export default function ProcessSocketTransfers(){
  return API.ConnectSocket(this.props.user)
  .then(socket => {

    socket.on('SERVER_SENDING_ROOM_DATA', (rooms, messages) => {
      rooms.forEach(room => {room.color = GenerateRandomColor(HashCode(room._id.toString()))})

      messages.forEach(message => message.color = GenerateRandomColor(HashCode(message._id.toString())))
      messages = [...this.state.messages, ...messages]

      rooms = [...this.state.rooms, ...rooms]
      rooms.sort((a, b) => a.distance > b.distance ? -1 : 1)
      let filteredRooms = FilterRooms(this.state.searchString, rooms)

      this.setState({rooms, filteredRooms: filteredRooms, messages, dataLoaded: true, lastDownloadTime: Date.now()})
    })

    socket.on('ROOM_CREATED_NEARBY', roomData => {
      console.log(roomData)
    })

    socket.on('ROOM_DELETED_NEARBY', roomID => {
      console.log(roomID)
    })

    socket.on('NEW_CHAT', newMessage => {
      this.setState({messages: [newMessage, ...this.state.messages]})
    })

    return socket
  })
}
