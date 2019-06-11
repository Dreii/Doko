let serv = require('http').createServer()
let io = require('socket.io')(serv)

let ConnectUser = require('./socket-functions/connect-user')
let UserDisconnected = require('./socket-functions/user-disconnected')
let GetRooms = require('./socket-functions/get-rooms')
let CreateRoom = require('./socket-functions/create-room')
let SendMessage = require('./socket-functions/send-message')

//A class of socket helpers
class SocketController{
  constructor(){
    this.PORT = 3231
    this.io = io

    this.connect = (db) => {

      io.on('connection', (socket)=>{

        socket.on('USER_CONNECTED', (user) => {
          ConnectUser(db, socket, user)
        })

        socket.on('CLIENT_REQUESTING_ROOM_DATA', (userLoc, searchLoc, zoom, alreadyDownloaded, lastDownloadTime) => {
          GetRooms(socket, db, userLoc, searchLoc, zoom, alreadyDownloaded, lastDownloadTime)
        })

        socket.on('CLIENT_CREATING_ROOM', (user, roomData)=>{
          CreateRoom(user, roomData)
        })

        socket.on('CLIENT_SENDING_CHAT', (userID, roomID, message, sendTime)=>{
          SendMessage.call(this, db, userID, roomID, message, sendTime)
        })

        socket.on('disconnect', (db, socket) => {
          UserDisconnected(db, socket)
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
