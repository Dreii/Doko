import React, { Component } from 'react'
import './App.css' //Load styles global to the entire app.

//load the two main pages for the app,
//Auth blocks entry until the user has an account and is authorized,
//Home contains all of the main functionality and components of the app.
import Home from './pages/Home/Home'
import Auth from './pages/Auth/Auth'

//Load dotenv so we can load mapbox's map using our private API key.
import dotenv from 'dotenv'
dotenv.config()

class App extends Component {

  state = {
    auth: null, //the users auth token, if null or expired an auth screen is shown.
    user: null, //the users profile, if null then a profile creation page must be displayed.
  }

  componentDidMount(){
  }

  render() {
    //populate variables from state for easy access.
    let {auth, user} = this.state

    return (
      <div className="App">
        {/* if the auth token is not valid or user not set up, we display an auth page */}
        {auth === null || user === null || !user.name || !user.image ? (
          <Auth
            auth={auth}
            user={user}
            SetAuth={(auth, user)=>{this.setState({auth, user})}}
          />
        ):(
          // Once Auth and profile are ready, we display the normal app.
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
