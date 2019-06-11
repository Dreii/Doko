export default function FilterRooms(search, data){
  search = search.toLowerCase()
  let ret = search !== '' ? (
    data.filter(
    room => (
      room.title.toLowerCase().includes(search)
      ||room.description.toLowerCase().includes(search)
      ||room.creator.name.toLowerCase().includes(search)
    ))
  ):(
    data
  )

  return ret
}
