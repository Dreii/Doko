/**
 * [Connect a user to the socket controller]
 * @param  {[SocketObject]} socket [Incomming Socket]
 * @param  {[DatabaseController]} db [Database Controller]
 * @param  {[Array]} searchLoc [Coordinates to search eg [lat, lng]]
 * @param  {[Number]} zoom [Current zoom level of the map requesting]
 * @param  {[Array]} alreadyDownloaded [Array of chat items ID's allready downloaded to limit queries]
 * @param  {[Date]} lastDownloadTime [Date Time object used to search for only new chat messages]
 */

module.exports = async function GetRooms(socket, db, userID, searchLoc, zoom, alreadyDownloaded, lastDownloadTime){
  try{
    //Find the user data for the user making this request and adjust their last search location.
    let user = await db.schemas.User.findOneAndUpdate({_id: userID}, {
      lastLocation: [searchLoc.longitude, searchLoc.latitude]
    })

    //find all rooms near the area being searched that are not already downloaded.
    let rooms = await db.schemas.Room.find({
      $and:[
        {_id: {$nin: alreadyDownloaded}},
        {location: {$geoWithin: {$center: [[ searchLoc.longitude, searchLoc.latitude ], (2*((15-zoom)+1))/111.12]}}}
      ]
    })
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
      select: 'name image color'
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

      //set whether or not this room is pinned by the requesting user,
      room.pinned = (user.subscriptions.includes(room._id))

      //and whether or not this room is created by the requesting user.
      room.ownedByUser = (room.creator._id.toString() === user._id.toString())
    })


    //send the data to the requesting client.
    socket.emit('SERVER_SENDING_ROOM_DATA', rooms)
  }catch(err){
    //error out on error.
    console.error("error grabbing rooms", err)
    socket.emit('SERVER_ERROR_GETTING_ROOM_DATA', err)
  }
}
