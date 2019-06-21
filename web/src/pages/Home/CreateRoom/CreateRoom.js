import React, { Component } from 'react'
import './CreateRoom.css'

import BackIcon from '../../../components/display/Icons/BackIcon'
import SearchIcon from '../../../components/display/Icons/SearchIcon'
import CheckIcon from '../../../components/display/Icons/CheckIcon'
import CrossHair from './CrossHair/CrossHair'
import Button from '../../../components/inputs/Button/Button'
import TextInput from '../../../components/inputs/TextInput/TextInput'

import API from '../../../functions/api'

class CreateRoom extends Component {

  state = {
    searchQuery: "",
    loading: false,
  }

  SendSearchQuery = () => {
    let {auth, MoveMap, HandleError} = this.props
    let {searchQuery} = this.state

    this.setState({loading: true})
    if(searchQuery !== ""){
      API.SendSecure(auth, 'search-location', {query: searchQuery})
      .then(res => {
        if(res.status === "OK"){
          let location = res.results[0].geometry.location
          MoveMap({latitude: location.lat, longitude: location.lng})
        }else{
          if(res.status === "NO_RESULTS")
            HandleError("no results", 0)
          else
            HandleError("error searching", 2)
        }
        this.setState({loading: false, searchQuery: ""})
      })
    }else{
      HandleError("No location entered", 1)
      this.setState({loading: false})
    }
  }

  CreateRoom = () => {
    let {socket, roomTitle, coords, userID, Close, HandleError} = this.props

    this.setState({loading: true})

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
    let {searchQuery, loading} = this.state
    return (
      <div id="placing-room-container">
        <TextInput id="placing-room-location-search" placeholder="Search for a location." value={searchQuery} onChange={(e)=>this.setState({searchQuery: e.target.value})}/>
        <Button svgIcon={<SearchIcon color={"#707070"}/>} loading={loading} id="placing-room-location-search-button" onClick={(auth, query)=>this.SendSearchQuery()}/>
        <p id="placing-room-text">Drag to place your room.</p>
        <Button svgIcon={<BackIcon color={"#707070"}/>} id="placing-room-back-button" onClick={Close} />
        <Button id="placing-room-button" primary svgIcon={<CheckIcon color={"white"}/>} loading={loading} value="Place" onClick={this.CreateRoom} />
        <CrossHair />
      </div>
    )
  }
}

export default CreateRoom
