const CalcDistance = require('../../functions/helpers').CalcDistance

/**
 * [Connect a user to the socket controller]
 * @param  {[SocketObject]} socket [Incomming Socket]
 * @param  {[DatabaseController]} db [Database Controller]
 * @param  {[Array]} userLoc [Coordinates of the users location eg [lat, lng]]
 * @param  {[Array]} searchLoc [Coordinates to search eg [lat, lng]]
 * @param  {[Number]} zoom [Current zoom level of the map requesting]
 * @param  {[Array]} alreadyDownloaded [Array of chat items ID's allready downloaded to limit queries]
 * @param  {[Date]} lastDownloadTime [Date Time object used to search for only new chat messages]
 */

module.exports = async function ConnectUser(socket, db, userLoc, searchLoc, zoom, alreadyDownloaded, lastDownloadTime){
  try{
      let rooms = await db.schemas.Room.find({
        $and:[
          {_id: {$nin: alreadyDownloaded}},
          {
            location: {
              $near: {
                $geometry: { type: "Point",  coordinates: [ searchLoc.longitude, searchLoc.latitude ] },
                $maxDistance: 2000*((15-zoom)+1)
              }
            }
          }
        ]
      }).populate('creator')

      let roomIDs = rooms.map(room => room._id)

      console.log(lastDownloadTime)

      let messageQuery = lastDownloadTime ? (
        {$and: [
          {$or:[
            {room: {$in: roomIDs}},
            {room: {$in: alreadyDownloaded}}
          ]},
          lastDownloadTime ? {created_at: {$gt: lastDownloadTime}}:true
        ]}
      ):(
        {$or:[
          {room: {$in: roomIDs}},
          {room: {$in: alreadyDownloaded}}
        ]}
      )

      let messages = await db.schemas.Message.find(messageQuery)
      .sort([['created_at', -1]])
      .populate('sender', 'name image')

      socket.emit('SERVER_SENDING_ROOM_DATA', rooms, messages)

      await db.schemas.User.findOneAndUpdate({socketID: socket.id}, {
        lastLocation:{
          type: 'Point', coordinates: [searchLoc.longitude, searchLoc.latitude]
        }
      })
  }catch(err){
    console.log(err)
    socket.emit('SERVER_ERROR_GETTING_ROOM_DATA', err)
  }
}


function GetHistory(roomCollection, messageCollection, roomID){
   return messageCollection.filter(message => message.room.toString() === roomID.toString())
}

function FormatRoomsForClient(roomCollection, messageCollection, userLoc){
  return roomCollection.map(room => {
    let history = GetHistory(roomCollection, messageCollection, room._id)//messages.filter(message => message.room.toString() === room._id.toString())
    let roomLat = room.location.coordinates[1], roomLng = room.location.coordinates[0]
    if(userLoc){
      distance = CalcDistance(roomLat, roomLng, userLoc.latitude, userLoc.longitude)
    }

    let newRoom = {
      _id: room._id,
      name: room.name,
      coordinates: {latitude: roomLat, longitude: roomLng},
      creator: room.creator,
      history,
    }

    return newRoom
  })
}
