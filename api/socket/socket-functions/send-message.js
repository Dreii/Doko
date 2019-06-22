/**
 * Receive a new message to a room and broadcast it to all users in that room.
 * @param  {[DatabaseController]} db [Database Controller]
 * @param  {[String]} userID        [ID of the user sending the message]
 * @param  {[String]} roomID      [ID of the room the message is entering]
 * @param  {[String]} message     [Body of the message]
 * @param  {[String]} sendTime    [DateTime ISO string for when the message was sent]
 */

 const mongoose = require('mongoose')
 const GenerateRandomColor = require('../../functions/helpers').GenerateRandomColor
 const HashCode = require('../../functions/helpers').HashCode

module.exports = async function(db, userID, roomID, roomColor, fromOwner, message, sendTime){

  //generate a random color for this message, excluding the room color.
  let color = fromOwner ? "owner" : GenerateRandomColor(HashCode(userID.toString()), roomColor)

  //create the new message.
  let newMessage = new db.schemas.Message({
    color,
    message,
    room: roomID,
    sender: userID,
    sendTime: sendTime
  })
  newMessage = await newMessage.save()

  //get the sender information for the message
  newMessage.sender = await db.schemas.User.findOne({_id: newMessage.sender}, 'name image')


  //create update query based on wether this message was sent from the room owner or not.
  let roomUpdate = fromOwner ? {
    $push:{
      messages: {
        $each: [newMessage],
        $position: 0
      }
    }
  }:{
    $push:{
      messages: {
        $each: [newMessage],
        $position: 0
      }
    },
    $addToSet:{members: userID}
  }

  //find the room to attach this to.
  let room = await db.schemas.Room.findOneAndUpdate({_id: roomID}, roomUpdate, {new: true})
  .populate('members')
  room.membersCount = room.members.length

  //find all users near this rooms point and send them this message.
  let usersSockets = await db.schemas.User.find({
    $and:[
      {online: true},
      {$or:[
        {subscriptions: roomID},
        {_id: room.creator},
        // {_id: userID},
        {lastLocation: {$geoWithin: {$center: [[ room.location[0], room.location[1] ], 10000]}}}
      ]}
    ]
  }, 'socketID').exec()

  let newMessageData = {
    message: newMessage,
    members: room.members.slice(room.membersCount-3),
    membersCount: room.membersCount
  }

  usersSockets.forEach(user => {
    this.io.sockets.in(user.socketID).emit("NEW_MESSAGE", newMessageData)
  })
}
