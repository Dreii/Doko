const fs = require('fs')
let https = require('https')

const serv = https.createServer({
  key: fs.readFileSync(process.env.SOCKET_SERVER_KEY),
  cert: fs.readFileSync(process.env.SOCKET_SERVER_CERT)
})

const io = require('socket.io')(serv)


const ConnectUser = require('./socket-functions/connect-user')
const UserDisconnected = require('./socket-functions/user-disconnected')
const GetRooms = require('./socket-functions/get-rooms')
const GetCreated = require('./socket-functions/get-created-rooms')
const GetSubs = require('./socket-functions/get-subscriptions')
const CreateRoom = require('./socket-functions/create-room')
const SendMessage = require('./socket-functions/send-message')
const PinRoom = require('./socket-functions/pin-room')
const DeleteRoom = require('./socket-functions/delete-room')

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

        socket.on('CLIENT_SEARCHING_AREA', (userID, searchLoc, zoom, alreadyDownloaded, lastDownloadTime) => {
          GetRooms(socket, db, userID, searchLoc, zoom, alreadyDownloaded, lastDownloadTime)
        })

        socket.on('CLIENT_REQUESTING_CREATED', (userID) => {
          GetCreated(socket, db, userID)
        })

        socket.on('CLIENT_REQUESTING_SUBSCRIPTIONS', (userID) => {
          GetSubs(socket, db, userID)
        })

        socket.on('CLIENT_CREATING_ROOM', (user, roomData) => {
          CreateRoom.call(this, socket, db, user, roomData)
        })

        socket.on('CLIENT_SENDING_CHAT', (userID, roomID, roomColor, fromOwner, message, sendTime)=>{
          SendMessage.call(this, db, userID, roomID, roomColor, fromOwner, message, sendTime)
        })

        socket.on('CLIENT_PINNING_ROOM', (userID, roomID, pinState) => {
          PinRoom.call(this, db, userID, roomID, pinState)
        })

        socket.on('CLIENT_DELETING_ROOM', (auth, roomID) => {
          DeleteRoom.call(this, db, auth, roomID)
        })

        socket.on('disconnect', (db, socket) => {
          UserDisconnected(db, socket)
        })

        socket.on('error', (error) => {
          console.log('SOCKET ERROR', error)
        })
      })

      io.on('error', (error) => console.log('IO ERROR', error))

      serv.listen(this.PORT, ()=>{
        console.log("CONNECTED to port: "+this.PORT);
      })
    }
  }
}

SocketController.io = io

module.exports = new SocketController();
