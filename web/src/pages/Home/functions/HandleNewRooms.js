import {CalcDistance} from '../../../functions/helpers'
import FilterRooms from './FilterRooms'

export default function HandleNewRooms(newRooms){
  //extract the neccesary data from state.
  let {rooms, searchString, userPosition, lastSearchedLocation} = this.state

  //If there are new rooms in the download,
  if(newRooms.length > 0){

    //as long as the user has agreed to location tracking, and we have their coordinates...
    userPosition && newRooms.forEach(room => {
      //give all of the new rooms a distance from the user.
      room.distance = CalcDistance(userPosition.latitude, userPosition.longitude, room.location[1], room.location[0])
    })

    //add the new rooms to the list.
    rooms.push(...newRooms)

    //sort each room by the distance from view.
    SortRooms(rooms, lastSearchedLocation)

    //the max length of the rooms collection is 30.
    rooms = rooms.length > 30 ? rooms.slice(30) : rooms

  }else{
      //if there are no rooms then we just want to reorganize
      SortRooms(rooms, lastSearchedLocation)
  }

  //select the new closest room but dont pan.
  if(rooms) this.SelectRoom(rooms[0]._id, {dontPan: true})

  //Finally we want to restructure our list of rooms filtered through the users search string.
  let filteredRooms = searchString !== "" ? FilterRooms(searchString, rooms) : rooms

  //set the state with our new data.
  this.setState({rooms, filteredRooms, lastDownloadTime: Date.now()})
}

//Take the last searched location and sort each room (asc) by its distance from that point.
function SortRooms(rooms, lastSearchedLocation){
  rooms.sort((room, other) => {
    let distFromView = CalcDistance(lastSearchedLocation.latitude, lastSearchedLocation.longitude, room.location[1], room.location[0])
    let otherDistFromView = CalcDistance(lastSearchedLocation.latitude, lastSearchedLocation.longitude, other.location[1], other.location[0])

    return distFromView - otherDistFromView
  })
}
