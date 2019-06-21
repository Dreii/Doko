import React, { Component } from 'react'
import './Map.css'

import ReactMapGL, {Marker, LinearInterpolator} from 'react-map-gl'
import {easeCubic} from 'd3-ease'

import Button from '../../../components/inputs/Button/Button'
import LocationIcon from '../../../components/display/Icons/LocationIcon'

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




  //on mount we set a ref for our map gl element.
  componentDidMount(){
    console.log(this.props)
    this.mapRef && this.setState({mapInstance: this.mapRef.getMap()})
  }




  //when the map loads, this method will call,
  //telling the map component and the home component
  //that our map is ready.
  onMapReady = () => {
    this.props.onMapReady()
    this.setState({mapLoaded: true, oldViewport: {...this.state.viewport}})
  }




  //Check and see if the moveCoordinates props has updated,
  //if so, set the viewport to the new coordinates.
  componentDidUpdate(prevProps){
    let {moveCoordinates} = this.props

    if(moveCoordinates && moveCoordinates !== prevProps.moveCoordinates)
      this.MoveMap(moveCoordinates)
  }



  //Method to pan the map to a new location with a linear ease.
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




  //Set the viewport (for internal user in the map component, used to move with mouse interactions)
  SetViewport = (viewport) => this.setState({viewport})




  //Checks for distances between the maps current point and the last point searched.
  SearchMap = () => {
    //if this map is in the middle of placing a room we want to ignore this.
    //also ignore if the mapdata hasnt loaded yet.
    if(this.props.placingRoom) return
    if(this.state.viewport === null || !this.state.viewport.latitude === null) return

    //extract needed data from state
    let {viewport, oldViewport, mapInstance} = this.state

    //project the current location and the location last searched at into pixel coordinates
    let newProj = mapInstance.project([viewport.longitude, viewport.latitude]),
    oldProj = mapInstance.project([oldViewport.longitude, oldViewport.latitude]),
    //calculate the x and y distance between the two points
    screenDistX = Math.abs(newProj.x - oldProj.x)/viewport.zoom,
    screenDistY = Math.abs(newProj.y - oldProj.y)/viewport.zoom

    //if the distance is to great,
    if((screenDistX > 10 || screenDistY > 10)){
      //Make a server request for rooms near this location.
      this.props.SearchForNewRooms(this.props.socket, {latitude: this.state.viewport.latitude, longitude: this.state.viewport.longitude}, this.state.viewport.zoom)

      //set the old viewport state to this as it is now the last place we searched.
      //also set pulse wich alows a display component to show, signifying a search was started to the user.
      this.setState({oldViewport: {...this.state.viewport}, pulse: true})
      setTimeout(()=>this.setState({pulse: false}), 500)
    }

  }




  //Method for displaying all map pointers associated with room data.
  ShowPointers(filteredRooms, selectedRoom, OpenRoom, SelectRoom){
    return filteredRooms.map((room, i) => {
      return(
        <Marker key={room._id} latitude={room.location[1]} longitude={room.location[0]}>
          <Point
            color={room.color}
            chatNumber={room.messages.length}
            selected={room.selected}
            room={room}
            OpenRoom={OpenRoom}
            SelectRoom={SelectRoom}
          />
        </Marker>
      )
    })
  }




  render() {
    let {userPosition, moveCoordinates, selectedRoom, OpenRoom, SelectRoom, filteredRooms, hide, placingRoom, CreateRoomUI} = this.props
    return (
      <div className={`Map ${hide ? "hide":""} ${this.state.mapLoaded && "ready"}`}>
        <ReactMapGL
          {...this.state.viewport} // allways map the current viewport.
          onViewportChange={this.SetViewport} //set the viewport based on changes.
          mapStyle={process.env.REACT_APP_MAPBOX_STYLE} //the mapbox style for Doko

          //ensure the map styays full width and height through resizing
          width='100%' height='100%'

          //Max and min zoom for the map.
          maxZoom={15} minZoom={10}

          //Interaction listeners, to check if we should search for new rooms.
          onMouseUp={this.SearchMap}
          onTouchEnd={this.SearchMap}
          onTransitionEnd={this.SearchMap}

          //the current viewport position, or the position passed down from Home(for when the component is still initializing.)
          latitude = {(this.state.viewport.latitude || moveCoordinates.latitude)}
          longitude = {(this.state.viewport.longitude || moveCoordinates.longitude)}

          //onLoad handler, sets the map as ready both in this component and in Home
          onLoad={this.onMapReady}

          //Set up map ref.
          ref={map => this.mapRef = map}
        >

          {/* if not hiding, and there are rooms to show, then show the map pointers */}
          {!hide && filteredRooms && this.ShowPointers(filteredRooms, selectedRoom, OpenRoom, SelectRoom)}

          {/* if the user position is being tracked, and we are not hiding, show a marker for the users location. */}
          {userPosition && !hide && (
            <Marker latitude={userPosition.latitude} longitude={userPosition.longitude} offsetX={-8} offsetY={-8}>
              <div id="location-indicator"></div>
            </Marker>
          )}

          {/* if the user position is being tracked, and we are not hiding, show a button to pan the map to the users location. */}
          {userPosition && !hide && (
            <Button svgIcon={<LocationIcon color={"#707070"}/>} id="location-button" className={placingRoom || !filteredRooms ? "bottom":""} onClick={() => this.MoveMap(userPosition)} />
          )}

          {/* Whenever we search a new location, display a pulse over the map at that location. */}
          {this.state.pulse && (
            <Marker latitude={this.state.oldViewport.latitude} longitude={this.state.oldViewport.longitude}>
              <div className="new-search-marker"></div>
            </Marker>
          )}

          {/* When placing a new room, show the correct UI */}
          {placingRoom && (
            CreateRoomUI({latitude: this.state.viewport.latitude, longitude: this.state.viewport.longitude})
          )}

        </ReactMapGL>
      </div>
    )
  }
}

export default Map
