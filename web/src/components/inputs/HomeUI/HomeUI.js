import React, { Component } from 'react'

import TextInput from '../../../components/inputs/TextInput/TextInput'
import Button from '../../../components/inputs/Button/Button'
import AddIcon from '../../../components/display/Icons/AddIcon'
import RoomsIcon from '../../../components/display/Icons/RoomsIcon'
import SearchIcon from '../../../components/display/Icons/SearchIcon'
import BackIcon from '../../../components/display/Icons/BackIcon'

import {CSSTransition} from 'react-transition-group'

import AddPage from './pages/AddPage'
import RoomsPage from './pages/RoomsPage'
import SearchPage from './pages/SearchPage'
import SettingsPage from './pages/SettingsPage'

import ValidateForm from './ValidateForm'
import ProfileUpdate from './ProfileUpdate'
import HandleSearch from './HandleSearch'


import './HomeUI.css'

class HomeUI extends Component {

  state = {
    page: "add", //add||rooms||search||settings
    windowX: window.innerWidth,
    addRoomTitle: "",
    searchLocation: "",
    searchRooms: "",
    showingDynamicRoomSearch: false,
    changeImage: "",
    changeEmail: "",
    changePassword: "",
    changePasswordConfirm: "",
    changeFirstName: "",
    changeLastName: "",
    formTarget: "", //Target for success and loading states on the form
    formLoading: false, //wether or not to show a loading state on target form button
    formSuccess: false, //wether or not to show a loading state on target form button
  }

  componentDidMount(){
    window.addEventListener('resize', this.ResizeHandler)
    window.addEventListener('keyup', this.HandleEnterPressed)
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.ResizeHandler)
    window.removeEventListener('keyup', this.HandleEnterPressed)
  }

  ResizeHandler = (e) => {this.setState({windowX: window.innerWidth})}

  SwitchPage = (page) => this.setState({page})

  //Change one of the input fields in the form.
  ChangeField = (string, field) => this.setState({[field]: string})

  //Set the success state, then begin the timer to stop it.
  SetSuccess = () => {
    this.setState({formLoading: false, formSuccess: true})

    //begin success timer.
    window.clearTimeout(this.successTimer)
    this.successTimer = window.setTimeout(()=>this.setState({formSuccess: false}), 1000)
  }

  //Set where each of the UI buttons should reside based on the app state
  GetButtonX = (index) => {
    if(this.props.hide) return -70
    if(!this.props.open) return 16

    let width = this.state.windowX-(52+64)
    return (index*(width/3))+32
  }

  HandleEnterPressed = (e) => {
    if(e.key !=='Enter') return

    let {page, formLoading} = this.state
    if(!formLoading){
      if(page === "add") this.AddRoom()
      if(page === "search") this.HandleSearch()
      if(page === "settings") this.ProfileUpdate()
    }
  }

  AddRoom = () => {
    if(this.state.addRoomTitle === "") return this.props.HandleError('Rooms need a title', 0)

    this.props.CreateRoom(this.state.addRoomTitle)
    this.setState({addRoomTitle: ""})
  }

  ValidateForm = ValidateForm.bind(this)

  //Validates profile setup form, and sends a user update request to the server,
  //processes the response and either sets the updated profile data or displays an error.
  ProfileUpdate = ProfileUpdate.bind(this)

  HandleSearch = HandleSearch.bind(this)

  render() {
    let {
      auth, user, SetAuth, hide, Logout,
      HandleError, open, SetMenuOpen, CreateRoom,
      subscribedRooms, createdRooms, OpenRoom, PinRoom, DeleteRoom
    } = this.props

    let {
      page, addRoomTitle, searchLocation, searchRooms, changeImage, changeEmail,
      changePassword, changePasswordConfirm, changeFirstName,
      changeLastName, formLoading, formSuccess, formTarget,
      showingDynamicRoomSearch
    } = this.state

    return (
      <div className="home-ui">
        <div id="menu" className={open ? "open":undefined}>
          <div className="menu-items">
            <div className="menu-buttons">
              <Button
                id="home-button"
                className={`home-ui-button ${page === "add" && "active"}`}
                svgIcon={<AddIcon color={page === "add" ? "white":"#707070"} />}
                primary={page==="add"}
                onClick={() => open ? this.SwitchPage("add") : SetMenuOpen(true)}
                style={{left: this.GetButtonX(0)}}
              />

              <Button
                id="rooms-button"
                className={`home-ui-button ${page === "rooms" && "active"}`}
                svgIcon={<RoomsIcon color={page === "rooms" ? "white":"#707070"} />}
                primary={page==="rooms"}
                onClick={() => open ? this.SwitchPage("rooms") : SetMenuOpen(true)}
                style={{left: this.GetButtonX(1)}}
              />

              <Button
                id="search-button"
                className={`home-ui-button ${page === "search" && "active"}`}
                svgIcon={<SearchIcon color={page === "search" ? "white":"#707070"} />}
                primary={page==="search"}
                onClick={() => open ? this.SwitchPage("search") : SetMenuOpen(true)}
                style={{left: this.GetButtonX(2)}}
              />

              <Button
                id="settings-button"
                className={`home-ui-button ${page === "settings" && "active"}`}
                icon={user.image}
                primary={page==="settings"}
                onClick={() => open ? this.SwitchPage("settings") : SetMenuOpen(true)}
                style={{left: this.GetButtonX(3)}}
              />

              <TextInput
                className={`dynamic-room-search ${showingDynamicRoomSearch && !hide ? "show":""}`}
                disabled={!showingDynamicRoomSearch}
                value={searchRooms}
                onChange={(e) => {
                  this.setState({searchRooms: e.target.value})
                  this.props.SetFilteredRooms(e.target.value)
                }}
                onBlur={()=> {
                  console.log("blur")
                  return searchRooms.length === 0 ? this.setState({showingDynamicRoomSearch: false}):null
                }}
                style={{left: this.GetButtonX(2)}}
              />
            </div>

            <div className="menu-page">
              <div className="background-gradient"></div>
              <Button
                className="home-ui-back-button"
                svgIcon={<BackIcon color="#707070" />}
                onClick={() => {
                  if(page === "search" && searchRooms !== "")
                    this.setState({showingDynamicRoomSearch: true})
                  SetMenuOpen(false)
                }}
              />

              <CSSTransition in={open && page === "add"} timeout={0} unmountOnExit classNames="home-ui-page">
                <AddPage
                  title={addRoomTitle}
                  onTitleChange={(e)=>this.ChangeField(e.target.value, "addRoomTitle")}
                  onSubmit={this.AddRoom}
                  loading={formTarget="create-room" && formLoading}
                  success={formTarget="create-room" && formSuccess}
                  SetSuccess={this.SetSuccess}
                />
              </CSSTransition>

              <CSSTransition in={open && page === "rooms"} timeout={0} unmountOnExit classNames="home-ui-page">
                <RoomsPage
                  createdRooms={createdRooms}
                  subscribedRooms={subscribedRooms}
                  OpenRoom={OpenRoom}
                  PinRoom={PinRoom}
                  DeleteRoom={DeleteRoom}
                />
              </CSSTransition>

              <CSSTransition in={open && page === "search"} timeout={0} unmountOnExit classNames="home-ui-page">
                <SearchPage
                  place={searchLocation}
                  onPlaceChange={(e)=>this.ChangeField(e.target.value, "searchLocation")}
                  rooms={searchRooms}
                  onRoomsChange={(e)=>this.ChangeField(e.target.value, "searchRooms")}
                  onSubmit={this.HandleSearch}
                  loading={formTarget="search" && formLoading}
                  success={formTarget="search" && formSuccess}
                  SetSuccess={this.SetSuccess}
                />
              </CSSTransition>

              <CSSTransition in={open && page === "settings"} timeout={0} unmountOnExit classNames="home-ui-page">
                <SettingsPage
                  user={user}
                  auth={auth}
                  image={changeImage}
                  onImageChange={(image) => SetAuth(auth, {...user, image})}
                  email={changeEmail}
                  onEmailChange={(e)=>this.ChangeField(e.target.value, "changeEmail")}
                  password={changePassword}
                  onPasswordChange={(e)=>this.ChangeField(e.target.value, "changePassword")}
                  passwordConfirm={changePasswordConfirm}
                  onPasswordConfirmChange={(e)=>this.ChangeField(e.target.value, "changePasswordConfirm")}
                  firstName={changeFirstName}
                  onFirstNameChange={(e)=>this.ChangeField(e.target.value, "changeFirstName")}
                  lastName={changeLastName}
                  onLastNameChange={(e)=>this.ChangeField(e.target.value, "changeLastName")}
                  onSubmit={this.ProfileUpdate}
                  onLogout={()=>SetAuth(null)}
                  loading={formTarget="user-update" && formLoading}
                  success={formTarget="user-update" && formSuccess}
                  SetSuccess={this.SetSuccess}
                />
              </CSSTransition>
            </div>
          </div>

        </div>
      </div>
    )
  }

}

export default HomeUI
