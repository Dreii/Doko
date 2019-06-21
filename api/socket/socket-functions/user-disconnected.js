/**
 * [Function to handle removing a socket/user from the socket controller list]
 * @param  {DatabaseController} db [Database Controller]
 * @param  {Socket} socket [Socket that is disconnecting]
 */

module.exports = async function UserDisconnected(db, socket){
  if(!socket) return

  let user = await db.schemas.User.findOneAndUpdate({socketID: socket.id}, {$set: {socketID: null, online: false, lastDownloadTime: null}}).exec()
}
