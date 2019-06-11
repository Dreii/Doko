/**
 * Receive a new message to a room and broadcast it to all users in that room.
 * @param  {[DatabaseController]} db [Database Controller]
 * @param  {[String]} userID        [ID of the user sending the message]
 * @param  {[String]} roomID      [ID of the room the message is entering]
 * @param  {[String]} message     [Body of the message]
 * @param  {[String]} sendTime    [DateTime ISO string for when the message was sent]
 */

module.exports = async function(db, userID, roomID, message, sendTime){

  let newMessage = new db.schemas.Message({
    message,
    room: roomID,
    sender: userID,
    sendTime: sendTime
  })

  newMessage = await newMessage.save()
  newMessage.sender = await db.schemas.User.findOne({_id: newMessage.sender}, 'name image')

  let room = await db.schemas.Room.findOne({_id: roomID})

  let usersSockets = await db.schemas.User.find({
    $and:[
      {online: true},
      {lastLocation: {$ne: { type: "Point",  coordinates: [ 0, 0 ] }}},
      {
        lastLocation: {
          $near: {
            $geometry: { type: "Point",  coordinates: [ room.location.coordinates[0], room.location.coordinates[1] ] },
            $maxDistance: 10000
          }
        }
      }
    ]
  }, 'socketID').exec()

  console.log(newMessage)

  usersSockets.forEach(user => {
    this.io.sockets.in(user.socketID).emit("NEW_CHAT", newMessage)
  })
}
