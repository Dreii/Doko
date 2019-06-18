import React, { Component } from 'react'
import './Map.css'

import ReactMapGL, {Marker, LinearInterpolator} from 'react-map-gl'
import {CSSTransition} from 'react-transition-group'
import {easeCubic} from 'd3-ease'
import {iRandom} from '../../functions/helpers'

import Button from '../inputs/Button/Button'
import LocationIcon from '../display/Icons/LocationIcon'

import Point from './Point'

class Map extends Component {

  state = {
    viewport: {
      width: "100%",
      height: "100%",
      latitude: null,
      longitude: null,
      zoom: 12,
    },
    oldViewport:null,
    mapLoaded: false,
    mapInstance: null,
    pulse:false
  }

  //if there is an image already in the user profile when this component loads,
  //we want to load it by default.
  componentDidUpdate(prevProps){
    // console.log("update")
    let {moveCoordinates, rooms, selectedRoom, searchPosition} = this.props
    // if(rooms && prevProps.selectedRoom !== selectedRoom){
    //   let coords = rooms[selectedRoom].location
    //   coords = {latitude: coords[1], longitude: coords[0]}
    //   this.MoveMap(coords)
    // }

    if(moveCoordinates && moveCoordinates !== prevProps.moveCoordinates){
      this.MoveMap(moveCoordinates)
    }
    //
    // if(searchPosition && prevProps.searchPosition !== searchPosition){
    //   this.MoveMap(searchPosition)
    // }
  }

  MoveMap = (coords) => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        longitude: coords.longitude,
        latitude: coords.latitude,
        transitionDuration: 500,
        transitionInterpolator: new LinearInterpolator(),
        transitionEasing: easeCubic
      }
    })
  }

  SetViewport = (viewport) => {
    this.setState({viewport})
    this.UpdateChatSearch()
  }

  ClickPointer = (room) => {
    if(room.selected) this.props.OpenRoom(room)
    else this.props.SelectRoom(room._id)
  }

  UpdateChatSearch = () => {
    clearTimeout(this.delay)
    this.delay = setTimeout(this.SearchMap, 500)
  }

  SearchMap = () => {
    let {viewport, oldViewport, mapInstance} = this.state
    oldViewport = oldViewport || this.props.viewPosition

    let newProj = mapInstance.project([viewport.longitude, viewport.latitude]),
        oldProj = mapInstance.project([oldViewport.longitude, oldViewport.latitude]),
        screenDistX = Math.abs(newProj.x - oldProj.x)/viewport.zoom,
        screenDistY = Math.abs(newProj.y - oldProj.y)/viewport.zoom

    if((screenDistX > 10 || screenDistY > 10) && !this.props.placingRoom){
      this.props.SearchForNewRooms({latitude: this.state.viewport.latitude, longitude: this.state.viewport.longitude}, this.state.viewport.zoom)
      this.setState({oldViewport: {...this.state.viewport}, pulse: true})
      setTimeout(()=>this.setState({pulse: false}), 500)
    }
  }

  componentDidMount(){
    this.mapRef && this.setState({mapInstance: this.mapRef.getMap()})
  }

  render() {
    let {userPosition, viewPosition, rooms, selectedRoom, OpenRoom, SelectRoom, filteredRooms, messages, hide, placingRoom, CreateRoom} = this.props
    return (
      <div className={`Map ${hide ? "hide":""} ${this.state.mapLoaded && "ready"}`}>
        <ReactMapGL
          {...this.state.viewport}
          onViewportChange={this.SetViewport}
          mapStyle="mapbox://styles/dreii/cjvfy7qvw0hxk1fpmvwojdakr"
          width='100%'
          height='100%'
          maxZoom={15}
          minZoom={10}
          // default the lat and lng to the users position(or centered on austin if location is not allowed)
          // in the beginning, then allow it to be changed by the map
          latitude = {(this.state.viewport.latitude || (viewPosition.latitude))}
          longitude = {(this.state.viewport.longitude || (viewPosition.longitude))}
          onLoad={()=>this.setState({mapLoaded: true})}
          keyboard={false}
          ref={map => this.mapRef = map}
        >
          {!placingRoom && filteredRooms && ShowPointers(filteredRooms, selectedRoom, messages, OpenRoom, SelectRoom)}

          {userPosition && !placingRoom && (
            <Marker latitude={userPosition.latitude} longitude={userPosition.longitude} offsetX={-8} offsetY={-8}>
              <div id="location-indicator"></div>
            </Marker>
          )}

          {userPosition && !hide && (
            <Button svgIcon={<LocationIcon color={"#707070"}/>} id="location-button" className={placingRoom || !filteredRooms ? "bottom":""} onClick={() => this.MoveMap(userPosition)} />
          )}

          {this.state.pulse && (
            <Marker latitude={this.state.oldViewport.latitude} longitude={this.state.oldViewport.longitude}>
              <div className="new-search-marker"></div>
            </Marker>
          )}

          {placingRoom && (
            CreateRoom({latitude: this.state.viewport.latitude, longitude: this.state.viewport.longitude})
          )}

        </ReactMapGL>
      </div>
    )
  }
}

export default Map

function ShowPointers(filteredRooms, selectedRoom, messages, OpenRoom, SelectRoom){
  return filteredRooms.map((room, i) => {
    return(
      <Marker key={room._id} latitude={room.location[1]} longitude={room.location[0]}>
        <Point
          color={room.color}
          chatNumber={room.membersCount}
          selected={room.selected}
          room={room}
          OpenRoom={OpenRoom}
          SelectRoom={SelectRoom}
        />
      </Marker>
    )
  })
}
