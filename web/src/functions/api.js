import io from 'socket.io-client'
const socketUrl = `http://${window.location.hostname}:3231`
let baseUrl = ``

class API{
  static SendPost(endpoint, body){
    let payload = {...this.postData, body: JSON.stringify(body)}
    return this.handleResponse(fetch(baseUrl+'/'+endpoint, payload))
  }

  static ConnectSocket = (userID) => {
    return new Promise((resolve, reject) => {
      console.log("attempting connection")
      const socket = io(socketUrl)
      socket.on('connect', ()=>{
        socket.emit('USER_CONNECTED', userID)
        resolve(socket)
      })

      socket.on('error', (err) => {
        reject(err)
      })
    })
  }

  static RequestRooms(socket, userLoc, searchLoc, downloaded){
    return new Promise((resolve, reject) => {
      socket.emit('CLIENT_REQUESTING_ROOM_DATA', userLoc, searchLoc, downloaded)
      socket.on('SERVER_SENDING_ROOM_DATA', (roomData) => {
        resolve(roomData)
      })

      socket.on('SERVER_ERROR_GETTING_ROOM_DATA', (err)=> {
        console.log(err)
        reject(err)
      })
    })
  }

  static handleResponse(promise){
    return promise
      .then(response => {
        return response.json()
      })
      .then((body) => {
        console.log(body)
        if(body.error) throw body.error

        return body
      })
  }
}

API.postData = {
   method: "POST",
   headers:{
     accept: "application/json",
     "Content-type": "application/json",
   }
}

API.subscriptions = [];

export default API;
