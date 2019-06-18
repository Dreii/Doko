const CalcDistance = require('../../functions/helpers').CalcDistance

/**
 * [Connect a user to the socket controller]
 * @param  {[SocketObject]} socket [Incomming Socket]
 * @param  {[DatabaseController]} db [Database Controller]
 * @param  {[Array]} searchLoc [Coordinates to search eg [lat, lng]]
 * @param  {[Number]} zoom [Current zoom level of the map requesting]
 * @param  {[Array]} alreadyDownloaded [Array of chat items ID's allready downloaded to limit queries]
 * @param  {[Date]} lastDownloadTime [Date Time object used to search for only new chat messages]
 */

module.exports = async function ConnectUser(socket, db, userID, searchLoc, zoom, alreadyDownloaded, lastDownloadTime){
  try{
    console.log(socket.id)

    let user = await db.schemas.User.findOneAndUpdate({_id: userID}, {
      lastLocation:{
        type: 'Point', coordinates: [searchLoc.longitude, searchLoc.latitude]
      }
    })
    .select('subscriptions')

    let rooms = await db.schemas.Room.find({
      $and:[
        {_id: {$nin: alreadyDownloaded}},
        {$or:[
          {creator: {$eq: user._id}},
          {_id: {$in: user.subscriptions}},
          {location: {$geoWithin: {$center: [[ searchLoc.longitude, searchLoc.latitude ], (2*((15-zoom)+1))/111.12]}}}
        ]}
      ]
    }).populate('creator')

    let roomIDs = rooms.map(room => room._id)

    let messageQuery = {
      $and: [
        {$or:[
          {room: {$in: roomIDs}},
          {room: {$in: alreadyDownloaded}}
        ]},
        lastDownloadTime ? {created_at: {$gt: lastDownloadTime}}:{_id:{$exists: true}}
      ]
    }

    let messages = await db.schemas.Message.find(messageQuery)
    .sort([['created_at', -1]])
    .populate('sender', 'name image')

    socket.emit('SERVER_SENDING_ROOM_DATA', rooms, messages)
  }catch(err){
    console.log(err)
    socket.emit('SERVER_ERROR_GETTING_ROOM_DATA', err)
  }
}
