/**
 * Create a new chatroom at a location
 * @param  {[String]} user     [User id for the creator of the room]
 * @param  {[String]} roomID   [Id of the room being pinned]
 * @param  {[Boolean]} pinState [whether the room is being pinned or unpinned]
 */

module.exports = async function(db, auth, roomID){
  //verify the auth token to ensure that the user deleting is the correct one.
  let decoded = require('jsonwebtoken').verify(auth, process.env.JWT_SECRET)

  let room = await db.schemas.Room.findOneAndDelete({$and:[{_id: roomID}, {creator: decoded._id}]}).exec()

  if(room !== null){

    await db.schemas.User.updateMany({$or:[{subscriptions: roomID}, {createdRooms: roomID}]}, {
      $pull: {subscriptions: roomID},
      $pull: {createdRooms: roomID}
    }).exec()


    let usersSockets = await db.schemas.User.find({
      $and:[
        {online: true},
        {$or:[
          {subscriptions: roomID},
          {_id: decoded._id},
          {lastLocation: {$geoWithin: {$center: [[ room.location[0], room.location[1] ], 10000]}}}
        ]}
      ]
    }, 'socketID').exec()

    usersSockets.forEach(user => {
      this.io.sockets.in(user.socketID).emit("ROOM_DELETED", roomID)
    })
  }
}
