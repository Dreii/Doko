/**
 * [Connect a user to the socket controller]
 * @param  {[DatabaseController]} db [Database Controller]
 * @param  {[SocketObject]} socket [Incomming Socket]
 * @param  {[String]} userID   [User ID of the user connecting]
 */

module.exports = async function ConnectUser(db, socket, userID){
  if(!userID) throw Error('User ID not found!')
  let user = await db.schemas.User.findOneAndUpdate({_id: userID}, {$set: {socketID: socket.id, online: true}}).exec()
}
