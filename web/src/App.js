import React, { Component } from 'react'
import './App.css'

import Home from './pages/Home/Home'
import Auth from './pages/Auth/Auth'

import dotenv from 'dotenv'
dotenv.config()

class App extends Component {

  state = {
    auth: null, //the users auth token, if null or expired an auth screen is shown
    user: null, //the users profile, if null then a profile creation page must be displayed

    chats: null, //an object containing all nearby chatroom data and messages
    selectedChat: null, //the current chatroom selected by the user
    currentLat: null, //the current lattitude that the map is on
    currentLng: null, //the current longitude that the map is on
    usersMessage: "", //the message that the user is typing
  }

  render() {
    let {auth, user} = this.state
    return (
      <div className="App">
        {/* if the auth token is not valid or user not set up, we display an auth page */}
        {auth === null || user === null || !user.firstName || !user.image ? (
          <Auth
            auth={auth}
            user={user}
            SetAuth={(auth, user)=>{this.setState({auth, user})}}
          />
        ):(
          <Home
            user={user}
            SetAuth={(auth, user)=>{this.setState({auth, user})}}
          />
        )}
      </div>
    )
  }

}

export default App
