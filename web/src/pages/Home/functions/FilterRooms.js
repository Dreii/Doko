export default function FilterRooms(search, data){
  console.log(search, data)
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

  return ret.length > 0 ? ret : null
}
