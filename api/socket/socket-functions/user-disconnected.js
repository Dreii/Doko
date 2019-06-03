/**
 * [Function to handle removing a socket/user from the socket controller list]
 * @param  {Socket} socket [Socket that is disconnecting]
 */

module.exports = function UserDisconnected(socket){
  //find the index of the user socket object which
  //coresponds to the socket that disconnected
  let index = this.connectedUsers.findIndex(obj =>{
    return obj.socket === socket
  })

  //splice out the user socket object at that findIndex
  //from the list of connected users
  this.connectedUsers.splice(index, 1)
}
