import React, { Component } from 'react'
import './Map.css'

import ReactMapGL, {Marker, LinearInterpolator} from 'react-map-gl'
import {CSSTransition} from 'react-transition-group'
import {easeCubic} from 'd3-ease'
import {iRandom} from '../../functions/helpers'

import Point from '../Point/Point'

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

  componentWillReceiveProps(newProps){
    if(newProps.selectedRoom !== this.props.selectedRoom){
      const viewport = {
            ...this.state.viewport,
            longitude: this.props.chatData[newProps.selectedRoom].coordinates.longitude,
            latitude: this.props.chatData[newProps.selectedRoom].coordinates.latitude,
            zoom: 12,
            transitionDuration: 500,
            transitionInterpolator: new LinearInterpolator(),
            transitionEasing: easeCubic
        }
      this.setState({viewport})
    }
  }

  componentDidMount(){
    this.mapRef && this.setState({mapInstance: this.mapRef.getMap()})
  }

  render() {
    let {userPosition, viewPosition, chatData, selectedRoom, openRoom, selectRoom, roomOpen, filteredChatData} = this.props

    return (
      <div className={`Map ${roomOpen ? "hide":""} ${this.state.mapLoaded && "ready"}`}>
        <ReactMapGL
          {...this.state.viewport}
          onViewportChange={(viewport) => this.setState({viewport})}
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
          onInteractionStateChange={UpdateChatSearch.bind(this)}
          ref={map => this.mapRef = map}
        >
          {chatData.map((chatroom, i) => {
            let active = selectedRoom === i
            return(
              <Marker key={chatroom._id} latitude={chatroom.coordinates.latitude} longitude={chatroom.coordinates.longitude}>
                <CSSTransition in={this.state.mapLoaded} appear timeout={iRandom(1000)}>
                  <Point
                    map={this.map}
                    color={chatroom.color}
                    onClick={() => active ? openRoom(chatroom._id):selectRoom(chatroom._id)}
                    chatId={chatroom.chatID}
                    chatNumber={chatroom.history.length}
                    selected={active}
                    hide={filteredChatData ? !filteredChatData.find(filteredChat => filteredChat.id === chatroom.id):false}
                  />
                </CSSTransition>
              </Marker>
            )
          })}

          {userPosition && (
            <Marker latitude={userPosition.latitude} longitude={userPosition.longitude}>
              <div id="location-indicator"></div>
            </Marker>
          )}

          {this.state.pulse && (
              <Marker latitude={this.state.oldViewport.latitude} longitude={this.state.oldViewport.longitude}>
                <div className="new-search-marker"></div>
              </Marker>
          )}
        </ReactMapGL>
      </div>
    )
  }

}

export default Map

function UpdateChatSearch(){
  clearTimeout(this.delay)

  this.delay = setTimeout(()=>{
    let {viewport, oldViewport, mapInstance} = this.state
    oldViewport = oldViewport || this.props.viewPosition

    let newProj = mapInstance.project([viewport.longitude, viewport.latitude]),
        oldProj = mapInstance.project([oldViewport.longitude, oldViewport.latitude]),
        screenDistX = Math.abs(newProj.x - oldProj.x)/viewport.zoom,
        screenDistY = Math.abs(newProj.y - oldProj.y)/viewport.zoom

    if(screenDistX > 10 || screenDistY > 10){
      this.props.SearchChats({latitude: this.state.viewport.latitude, longitude: this.state.viewport.longitude})
      this.setState({oldViewport: {...this.state.viewport}, pulse: true})
      setTimeout(()=>this.setState({pulse: false}), 500)
    }
  }, 500)
}