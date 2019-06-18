/**
 * Create a new chatroom at a location
 * @param  {[String]} user     [User id for the creator of the room]
 * @param  {[Object]} roomData [Data for the room eg:{name, coordinates}]
 */

module.exports = async function(socket, db, userID, roomData){
  console.log(userID, roomData)

  let newRoom = new db.schemas.Room({
    location: [
      roomData.coords.longitude,
      roomData.coords.latitude
    ],
    name: roomData.name,
    creator: userID,
    created_at: new Date()
  })

  newRoom = await newRoom.save()
  newRoom.creator = await db.schemas.User.findOne({_id: newRoom.creator}, 'name image')

  let usersSockets = await db.schemas.User.find({
    $and:[
      {online: true},
      {_id: {$ne: userID}},
      {lastLocation: {$ne: { type: "Point",  coordinates: [ 0, 0 ] }}},
      {
        lastLocation: {
          $near: {
            $geometry: { type: "Point",  coordinates: [ newRoom.location[0], newRoom.location[1] ] },
            $maxDistance: 100000
          }
        }
      }
    ]
  }, 'socketID').exec()

  socket.emit('ROOM_CREATED', [newRoom])
  usersSockets.forEach(user => {
    this.io.sockets.in(user.socketID).emit("SERVER_SENDING_ROOM_DATA", [newRoom], [])
  })
}
