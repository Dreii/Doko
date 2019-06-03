const CalcDistance = require('../../functions/helpers').CalcDistance

/**
 * [Connect a user to the socket controller]
 * @param  {[SocketObject]} socket [Incomming Socket]
 */

module.exports = async function ConnectUser(socket, db, userLoc, searchLoc, alreadyDownloaded){
  try{
    console.log(searchLoc, alreadyDownloaded)
      let rooms = await db.schemas.Room.find({
        $and:[
          {_id: {$nin: alreadyDownloaded}},
          {
            location: {
              $near: {
                $geometry: { type: "Point",  coordinates: [ searchLoc.longitude, searchLoc.latitude ] },
                $maxDistance: 5000
              }
            }
          }
        ]
      }).populate('creator')

      let roomIDs = rooms.map(room => room._id)
      let messages = await db.schemas.Message.find({
        room: {$in: roomIDs}
      })
      .populate('sender')

      rooms = rooms.map(room => {
        let history = messages.filter(message => message.room.toString() === room._id.toString())

        let distance = null
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
          distance
        }

        return newRoom
      })

      socket.emit('SERVER_SENDING_ROOM_DATA', rooms)
  }catch(err){
    console.log(err)
    socket.emit('SERVER_ERROR_GETTING_ROOM_DATA', err)
  }

}
