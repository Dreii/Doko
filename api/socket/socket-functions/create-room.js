/**
 * Create a new chatroom at a location
 * @param  {[String]} user     [User id for the creator of the room]
 * @param  {[Object]} roomData [Data for the room eg:{name, coordinates}]
 */

module.exports = async function(socket, db, userID, roomData){

  //create a new room instance in the rooms collection,
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

  //find the creators information.
  newRoom.creator = await db.schemas.User.findOne({_id: userID}, 'name image color')

  //find a list of users who are online and last searched near this new rooms location.
  let usersSockets = await db.schemas.User.find({
    $and:[
      {online: true},
      {_id: {$ne:userID}},
      {lastLocation: {$ne: [0, 0]}},
      {lastLocation: {$geoWithin: {$center: [[ roomData.coords.longitude, roomData.coords.latitude ], 10000]}}}
    ]
  }, 'socketID').exec()

  //emit a room created event to the creator,
  socket.emit('ROOM_CREATED', newRoom)

  //and new room data to each client nearby.
  usersSockets.forEach(user => {
    this.io.sockets.in(user.socketID).emit("SERVER_SENDING_ROOM_DATA", [newRoom])
  })
}
