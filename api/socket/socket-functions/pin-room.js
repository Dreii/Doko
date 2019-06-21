/**
 * Create a new chatroom at a location
 * @param  {[String]} user     [User id for the creator of the room]
 * @param  {[String]} roomID   [Id of the room being pinned]
 * @param  {[Boolean]} pinState [whether the room is being pinned or unpinned]
 */

module.exports = async function(db, userID, roomID, pinState){


  let update = pinState ? {
    $push: {subscriptions: roomID}
  }:{
    $pull: {subscriptions: roomID}
  }

  console.log(update)

  await db.schemas.User.findOneAndUpdate({_id: userID}, update).exec()
}
