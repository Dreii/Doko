import FormatRoom from './FormatRoom'
import SortRooms from './SortRooms'

export default function AssimilateNewRoomData(newRooms, selectedRoom){
  let {messages, rooms, searchString, userPosition, pinnedRooms} = this.state
  let {user} = this.props

  rooms.push(...newRooms)
  rooms.forEach((room, i) => {
    //if no color assignment, then the room has not been formated.
    if(room.color === undefined){
      FormatRoom(room, messages, user._id, userPosition, pinnedRooms)
    }

    //select or deselect the correct room.
    room.selected = (selectedRoom === room._id)
  })

  //sort rooms by distance and ownership
  SortRooms(rooms, user)

  return rooms
}
