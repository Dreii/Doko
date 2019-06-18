export default function GetMembersForRoom(creatorID, userID, messages){
  let members = []
  messages.forEach(message => {
    //check each message to see if its sender is the current user,
    //or the creator of the room, or has already been entered into
    //the members array.
    if(
      message.sender === null
      || message.sender._id === creatorID
      || message.sender._id === userID
      || members.find(member => member._id === message.sender._id)
    ) return

    //if not, then add it to the members array.
    members.push(message.sender)
  })

  let display = members.slice(0, 3).reverse()

  return {
    display,
    members
  }
}
