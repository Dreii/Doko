/**
 * [Connect a user to the socket controller]
 * @param  {[SocketObject]} socket [Incomming Socket]
 * @param  {[DatabaseController]} db [Database Controller]
 * @param  {[String]} userID [ID of the user thats requesting data]
 */

module.exports = async function GetCreated(socket, db, userID){
  try{
    //Find all rooms that have this userID in their creator field,
    let rooms = await db.schemas.Room.find({creator: userID})
    //populate messages, and in each message populate the senders name and image.
    .populate({
      path: 'messages',
      populate: {
        path: 'sender',
        model: 'User',
        select: 'name image'
      }
    })
    //populate the creator object, its name image and random color.
    .populate({
      path: 'creator',
      select: 'name image'
    })
    //populate the members array, grabbing the name and image from each user within.
    .populate({
      path: 'members',
      select: 'name image'
    })

    rooms.forEach(room => {
      //format the members section to only send the length and the last 3 entries.
      room.membersCount = room.members.length
      if(room.membersCount > 3) room.members = room.members.slice(room.membersCount-3)

      //set the room as owned by user for the client
      room.ownedByUser = true
    })

    //send the data to the requesting client.
    socket.emit('SERVER_SENDING_CREATED_ROOMS', rooms)
  }catch(err){
    //error out on error.
    console.error("error grabbing rooms", err)
    socket.emit('SERVER_ERROR_GETTING_ROOM_DATA', err)
  }
}
