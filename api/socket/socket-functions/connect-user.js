/**
 * [Connect a user to the socket controller]
 * @param  {[SocketObject]} socket [Incomming Socket]
 * @param  {[String]} userID   [User ID of the user connecting]
 */

module.exports = function ConnectUser(socket, userID){
  //check if the user is already in the list of connected users
  let index = this.connectedUsers.findIndex(obj => obj.user.toString() === userID.toString())

  //if the user cannot be found, create a new entry in the list of connected users with
  //the user ID and Socket ID paired
  if(index < 0){
    this.connectedUsers.push({
      user: userID,
      socket: socket.id
    })
  }else{
    //if you are able to find the user ID then re-assign its socket to this new socket as the user
    //has reconnected.
    this.connectedUsers[index].socket = socket.id
  }
}
