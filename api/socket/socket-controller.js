let serv = require('http').createServer()
let io = require('socket.io')(serv)

let GetUserFromSocketID = require('./socket-functions/get-user-id-from-socket-id')
let ConnectUser = require('./socket-functions/connect-user')
let UserDisconnected = require('./socket-functions/user-disconnected')
let DisplayConnectedUsers = require('./socket-functions/display-connected-users')
let GetRooms = require('./socket-functions/get-rooms')

//A class of socket helpers
class SocketController{
  constructor(){
    this.PORT = 3231
    this.connectedUsers = []
    this.io = io

    this.connect = (db) => {
      io.on('connection', (socket)=>{

        socket.on('USER_CONNECTED', (user) => {
          ConnectUser.call(this, socket, user)
          DisplayConnectedUsers(this.connectedUsers, `NEW USER: ${user}`)
        })

        socket.on('CLIENT_REQUESTING_ROOM_DATA', (userLoc, searchLoc, alreadyDownloaded) => {
          GetRooms(socket, db, userLoc, searchLoc, alreadyDownloaded)
        })

        socket.on('disconnect', () => {
          UserDisconnected.call(this, socket)
          DisplayConnectedUsers(this.connectedUsers, `USER DISCONNECTED`)
        })
      })

      serv.listen(this.PORT, ()=>{
        console.log("CONNECTED to port: "+this.PORT);
      })
    }
  }
}

SocketController.io = io

module.exports = new SocketController();
