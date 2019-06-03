import API from '../../../functions/api'
import {GenerateRandomColor} from '../../../functions/helpers'
import FilterChatData from './FilterChatData'

export default function ProcessSocketTransfers(){
  return API.ConnectSocket(this.props.user)
  .then(socket => {

    socket.on('SERVER_SENDING_ROOM_DATA', (newChatData) => {
      newChatData.forEach((chat, i) => {
        chat.color = GenerateRandomColor(i)
        chat.members = chat.history.map(message => message.sender)
        chat.members = [...new Set(chat.members)]
      })

      let chatData = [...this.state.chatData, ...newChatData]

      chatData.sort((a, b) => a.distance > b.distance ? 1 : -1)

      let filteredChatData = FilterChatData(this.state.searchString, chatData)

      this.setState({chatData: chatData, filteredChatData: filteredChatData, dataLoaded: true})
    })

    return socket
  })
}
