export default function ChooseRoom(roomID){
  return this.state.filteredRooms.findIndex(chat => chat._id === roomID)
}
