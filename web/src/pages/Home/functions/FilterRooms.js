//take the array of data and filter it down to only entries that contain
//the search string in the title or creators name.
export default function FilterRooms(search, data){
  search = search.toLowerCase()
  let ret = search !== '' ? (
    data.filter(
    room => (
      room.name.toLowerCase().includes(search)
      ||room.creator.name.toLowerCase().includes(search)
    ))
  ):(
    data
  )

  //if no results came through, return null.
  return ret.length > 0 ? ret : null
}
