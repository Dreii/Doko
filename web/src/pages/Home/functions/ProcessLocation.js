export function GetInitialLocation(){
  return new Promise((resolve, reject) => {
    //if there is no navigation ability in the browser error out
    (!navigator || !navigator.geolocation) && Promise.reject("This device can't get location data.")

    navigator.geolocation.getCurrentPosition((position)=>{
      resolve(position)
    },(err)=>{
      reject(handleLocationError(err))
    })
  })
}

export function WatchLocation(){
  return new Promise((resolve, reject) => (
    navigator.geolocation.watchPosition(handleLocation.bind(this), handleLocationError.bind(this))
  ))
}

function handleLocation(position) {
  // ...do stuff
  console.log(position)
  return Promise.resolve(position)
}

function handleLocationError(error) {
  console.log(error)
  switch (error.code) {
    case 3:
      // ...deal with timeout
    return {message: "Location timed out."}

    case 2:
      // ...device can't get data
      return {message: "Device can't get data."}
    case 1:
      // ...user said no ☹️
      return {message: "Unable to get location."}
    default:
      return {message: "Unable to get location."}
  }
}
