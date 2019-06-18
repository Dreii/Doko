import GetMembersForRoom from './GetMembersForRoom'
import {GenerateRandomColor, HashCode} from '../../../functions/helpers'
import CalcDistance from '../../../functions/CalcDistance'

export default function FormatRoom(room, messages, userID, userPosition){
  room.color = GenerateRandomColor(HashCode(room._id.toString()))

  room.distance = CalcDistance(room.location[1], room.location[0], userPosition.latitude, userPosition.longitude)

  room.messages = messages.filter(message => message.room === room._id)

  let memberData = GetMembersForRoom(room.creator._id, userID, room.messages)
  room.members = memberData.members
  room.membersCount = memberData.members.length
  room.membersDisplay = memberData.display

  room.selected = false
  room.pinned = false

  return room
}
