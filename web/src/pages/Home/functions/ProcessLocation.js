//Check if this device can get location information
//and if the user is okay with this.
export async function StartTrackingLocation(){
  //Request the initial location...
  let userPosition = await GetInitialLocation.call(this)
  //if getting the location was a success, we will return it
  //and begin watching location over time.
  .then(pos => {
    WatchLocation.bind(this)
    return pos
  })
  //If we were unable to get device location, we will return a default set of coordinates
  //located in central austin.
  .catch(err => ({latitude: 30.2671537, longitude: -97.743057}))


  return userPosition
}


//Function to check if device can get location info, and return the location if so.
function GetInitialLocation(){
  return new Promise((resolve, reject) => {

    //if there is no navigation ability in the browser error out.
    if(!navigator || !navigator.geolocation){
      this.HandleError("Unable to get location.", 1)
      return reject()
    }

    //if device is able to get location, we setup success and failure handlers
    //and attempt to get the current position, then passing it on or erroring out.
    const onPositionSuccess = (position) => {
      resolve(handleLocation.call(this, position.coords))
    }

    const onPositionFailure = (err) => {
      reject(handleLocationError.call(this, err))
    }

    navigator.geolocation.getCurrentPosition(onPositionSuccess, onPositionFailure)
  })
}

//Watches the current location and passes it on or errors out.
function WatchLocation(){
  return new Promise((resolve, reject) => {

    //Setup success and failure handlers,
    //and watch the current position,
    //passing it on or erroring out.
    const onPositionSuccess = (position) => {
      resolve(handleLocation.call(this, position.coords))
    }

    const onPositionFailure = (err) => {
      reject(handleLocationError.call(this, err))
    }

    navigator.geolocation.watchPosition(onPositionSuccess,onPositionFailure)
  })
}

//When location data is found, we extract the coordinates, set them to the state and return them
function handleLocation(userPosition) {
  userPosition = {latitude: userPosition.latitude, longitude: userPosition.longitude}
  this.setState({userPosition})
  return userPosition
}

//When an error occurs trying to get locatino data, we extract the error code and error
//out a message.
function handleLocationError(error) {
  switch (error.code) {
    case 3: this.HandleError("Location timed out.", 1); break
    case 2: this.HandleError("Device can't get data.", 1); break
    case 1: this.HandleError("Location services denied.", 1); break
    default: this.HandleError("Unable to get location.", 1)
  }
  return null
}
