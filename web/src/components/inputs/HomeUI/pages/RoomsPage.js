import React, {Component} from 'react'
import './Pages.css'

import Button from '../../../inputs/Button/Button'

import SearchIcon from '../../../display/Icons/SearchIcon'
import TackPinnedIcon from '../../../display/Icons/TackPinnedIcon'
import ProfileImg from '../../../display/ProfileImg/ProfileImg'

class RoomsPage extends Component {
  render() {
    let {createdRooms, subscribedRooms, OpenRoom, PinRoom, DeleteRoom} = this.props

    return (
      <div className="rooms-page home-ui-page">
        <h1 className="home-ui-title">Pinned Rooms</h1>
        <div className="created-rooms-container">
          {subscribedRooms.length ? subscribedRooms.map((room, i) => (
            <ChatListing room={room} OpenRoom={OpenRoom} PinRoom={PinRoom} key={i} />
          )) : (
            <div className="no-data-container">
              <SearchIcon color="#707070" />
              <p>No rooms pinned!</p>
            </div>
          )}
        </div>

        <h2 className="home-ui-title">Created Rooms</h2>
        <div className="subscribed-rooms-container">
          {createdRooms.length ? createdRooms.map((room, i) => (
            <ChatListing room={room} OpenRoom={OpenRoom} DeleteRoom={DeleteRoom} key={i} created />
          )) : (
            <div className="no-data-container">
              <SearchIcon color="#707070" />
              <p>No rooms created!</p>
            </div>
          )}
        </div>
      </div>
    )
  }

}

export default RoomsPage

class ChatListing extends React.PureComponent {
  state = {
    deleteFormOpen: false
  }

  onClick = () => {this.props.OpenRoom(this.props.room)}
  onDeleteFormOpen = (e) => {e.stopPropagation(); this.setState({deleteFormOpen: true})}
  onDeleteFormClose = (e) => {e.stopPropagation(); this.setState({deleteFormOpen: false})}

  onDeleteRoom = (e) => {e.stopPropagation(); this.props.DeleteRoom(this.props.room._id)}
  onUnPin = (e) => {e.stopPropagation(); this.props.PinRoom(this.props.room._id)}

  render(){
    let {room, created} = this.props
    let {deleteFormOpen} = this.state
    let message = room.messages && room.messages[room.messages.length-1]

    return (
      <div className={`chat-listing ${room.color}`} onClick={this.onClick}>
        <h1>{room.name}</h1>
        {!created && <Button className={`subscription-button pinned`} svgIcon={<TackPinnedIcon/>} noBack onClick={this.onUnPin} />}
        {created && !deleteFormOpen && <Button className="delete-button" noBack value="Delete" onClick={this.onDeleteFormOpen} />}
        {created && deleteFormOpen && (
          <div className="delete-form">
            <p>Are you Sure?</p>
            <Button value="Yes" className="delete-form-button" onClick={this.onDeleteRoom} />
            <Button value="Nevermind" primary className="delete-form-button" onClick={this.onDeleteFormClose} />
          </div>
        )}
        {message && (
          <div className="last-message">
            <ProfileImg img={message.sender.image} size={23}/>
            <p>{message.message}</p>
          </div>
        )}
      </div>
    )
  }
}
