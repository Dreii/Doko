export default function(rooms, user){
  if(!Array.isArray(rooms)) return [];

  rooms.sort((a, b) => {
    let ret = 0
    let aCreated = a.creator._id === user._id,
        bCreated = b.creator._id === user._id


    if(aCreated === bCreated){
      return (a.distance < b.distance) ? -1 : (a.distance > b.distance) ? 1 : 0
    }else{
      return (aCreated && !bCreated) ? 1 : -1;
    }
  })
  
  return rooms
}
