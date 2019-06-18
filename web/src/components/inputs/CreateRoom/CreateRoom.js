import React, { Component } from 'react'
import './CreateRoom.css'

import BackIcon from '../../display/Icons/BackIcon'
import SearchIcon from '../../display/Icons/SearchIcon'
import CheckIcon from '../../display/Icons/CheckIcon'
import CrossHair from '../../display/CrossHair/CrossHair'
import Button from '../Button/Button'
import TextInput from '../TextInput/TextInput'

import API from '../../../functions/api'

class CreateRoom extends Component {

  state = {
    searchQuery: "",
    searchLoading: false,
  }

  SendSearchQuery = () => {
    let {auth, SetSearchCoords, HandleError, roomTitle} = this.props
    let {searchQuery} = this.state

    this.setState({searchLoading: true})
    if(searchQuery !== ""){
      API.SendSecure(auth, 'search-location', {query: searchQuery})
      .then(res => {
        if(res.status === "OK"){
          let location = res.results[0].geometry.location
          SetSearchCoords({latitude: location.lat, longitude: location.lng})
        }else{
          if(res.status === "NO_RESULTS")
            HandleError("no results", 0)
          else
            HandleError("error searching", 2)
        }
        this.setState({searchLoading: false, searchQuery: ""})
      })
    }else{
      HandleError("No location entered", 1)
      this.setState({searchLoading: false})
    }
  }

  CreateRoom = () => {
    let {socket, roomTitle, coords, userID, Close, HandleError} = this.props

    socket.emit('CLIENT_CREATING_ROOM', userID, {name: roomTitle, coords})

    return new Promise((resolve, reject)=>{
      let errorTimeout = window.setTimeout(()=>{
        HandleError('error creating room', 2)
        Close()
        reject()
      }, 30000)

      socket.on('ROOM_CREATED', newRoom => {
        window.clearTimeout(errorTimeout)
        Close()
        resolve(newRoom)
      })
    })
  }

  render() {
    let {Close} = this.props
    let {searchQuery, searchLoading} = this.state
    return (
      <div id="placing-room-container">
        <TextInput id="placing-room-location-search" placeholder="Search for a location." value={searchQuery} onChange={(e)=>this.setState({searchQuery: e.target.value})}/>
        <Button svgIcon={<SearchIcon color={"#707070"}/>} loading={searchLoading} id="placing-room-location-search-button" onClick={(auth, query)=>this.SendSearchQuery()}/>
        <p id="placing-room-text">Drag to place your room.</p>
        <Button svgIcon={<BackIcon color={"#707070"}/>} id="placing-room-back-button" onClick={Close} />
        <Button id="placing-room-button" primary svgIcon={<CheckIcon color={"white"}/>} value="Place" onClick={this.CreateRoom} />
        <CrossHair />
      </div>
    )
  }
}

export default CreateRoom
