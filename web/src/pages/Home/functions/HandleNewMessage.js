export default function HandleNewMessage(newMessageData){
  //get all of the room collections from state.
  let {rooms, pinnedRooms, createdRooms} = this.state

  //extract all of the data from the new message.
  let {message, members, membersCount} = newMessageData

  //Search the normal room collection to see if it is in there.
  let room = rooms.find(room => room._id === message.room)
  if(room) AdjustRoom(room, message, members, membersCount)

  //Search the pinned room collection to see if it is in there.
  //But only change the room if it was not in the original collection.
  let pinnedRoom = pinnedRooms.find(room => room._id === message.room)
  if(!room && pinnedRoom) AdjustRoom(pinnedRoom, message, members, membersCount)

  //Search the created room collection to see if it is in there.
  //But only change the room if it was not in the original collection.
  let createdRoom = createdRooms.find(room => room._id === message.room)
  if(!room && createdRoom) AdjustRoom(createdRoom, message, members, membersCount)

  //then set the new data.
  this.setState({rooms, pinnedRooms, createdRooms})
}

function AdjustRoom(room, message, members, membersCount){
  //add message to the begining of the rooms message array.
  room.messages.unshift(message)

  //then set the new members count and members display variables for the room.
  room.membersCount = membersCount
  room.members = members
}
