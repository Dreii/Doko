export default function ChooseRoom(roomID){
  return this.state.filteredChatData.findIndex(chat => chat._id === roomID)
}
