import io from 'socket.io-client'
const socketUrl = process.env.REACT_APP_SOCKETURL
let baseUrl = process.env.REACT_APP_APIURL

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

      const socket = io(socketUrl, {rejectUnauthorized: false})

      socket.on('connect', ()=>{
        socket.emit('USER_CONNECTED', user._id)
        resolve(socket)
      })

      socket.on('error', (err) => {
        reject(err)
      })
    })
  }

  static RequestRooms(socket, userID, searchLoc, zoom, downloaded, lastDownloadTime){
    return new Promise((resolve, reject) => {
      socket.emit('CLIENT_SEARCHING_AREA', userID, searchLoc, zoom, downloaded, lastDownloadTime)
      socket.on('SERVER_SENDING_ROOM_DATA', (roomData) => {
        resolve(roomData)
      })

      socket.on('SERVER_ERROR_GETTING_ROOM_DATA', (err)=> {
        console.error(err)
        reject(err)
      })
    })
  }



  static handleResponse(promise){
    return promise
      .then(response => {
        if(response.status === 500) throw Error('Server Error please try again')
        return response.json()
      })
      .then((body) => {
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
