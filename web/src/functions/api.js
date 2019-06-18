import io from 'socket.io-client'
const socketUrl = `http://${window.location.hostname}:3231`
let baseUrl = ``

class API{
  static SendPost(endpoint, body){
    let payload = {...this.postData, body: JSON.stringify(body)}
    return this.handleResponse(fetch(baseUrl+'/'+endpoint, payload))
  }

  static SendSecure(auth, endpoint, body){
    let payload = {...this.postData, body: JSON.stringify(body)}
    payload.headers.auth = auth
    return this.handleResponse(fetch(baseUrl+'/'+endpoint, payload))
  }

  static UploadImage(auth, formData){
    let payload = {...this.postFormData}
    payload.headers.auth = auth
    payload.body = formData

    return this.handleResponse(fetch(baseUrl+'/image-upload', payload))
  }

  static ConnectSocket = (user) => {
    return new Promise((resolve, reject) => {
      console.log("attempting connection")
      const socket = io(socketUrl)
      socket.on('connect', ()=>{
        socket.emit('USER_CONNECTED', user._id)
        resolve(socket)
      })

      socket.on('error', (err) => {
        reject(err)
      })
    })
  }

  static RequestRooms(socket, userLoc, searchLoc, zoom, downloaded, lastDownloadTime){
    console.log({socket, userLoc, searchLoc, zoom, downloaded})
    return new Promise((resolve, reject) => {
      socket.emit('CLIENT_REQUESTING_ROOM_DATA', userLoc, searchLoc, zoom, downloaded, lastDownloadTime)
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
        if(response.status === 500) throw Error('Server Error please try again')
        console.log(response)
        // if(response.status === 401) throw Error('Unauthorized')
        return response.json()
      })
      .then((body) => {
        console.log(body)
        if(body.error) throw Error(body.error)
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

API.postFormData = {
  method: "POST",
  headers:{
    // accept: "multipart/form-data",
    // "Content-type": "multipart/form-data"
  }
}

API.subscriptions = [];

export default API;
