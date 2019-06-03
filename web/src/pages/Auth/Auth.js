import React, { Component } from 'react'
import './Auth.css'

import TextInput from '../../components/TextInput/TextInput'
import Button from '../../components/Button/Button'
import Error from '../../components/Error/Error'

import {RandomProfileTestImage} from '../../functions/helpers'

import API from '../../functions/api'

class Auth extends Component {
  state = {
    page: "login",
    email: "",
    password: "",
    passwordConfirm: "",
    firstName: "",
    lastName: "",
    image: RandomProfileTestImage(),
    error: "",
    errorShake: false,
    errorLevel: 0
  }

  componentDidMount(){
    this.errorShakeTimer = window.setTimeout(this.setState({errorShake: false}), 1000)
  }

  HandleLogin(){
    if(ValidateForm.call(this)){
      this.setState({error:""})

      API.SendPost('login', {email: this.state.email, password: this.state.password})
      .then((res)=> this.props.SetAuth(res.token, res.user))
      .catch(error => SetError.call(this, error.toString(), 2))
    }
  }

  HandleSignup(){
    if(ValidateForm.call(this)){
      this.setState({error:""})

      API.SendPost('signup', {email: this.state.email, password: this.state.password})
      .then((res)=> this.props.SetAuth(res.token, res.user))
      .catch(error => SetError.call(this, error.toString(), 2))
    }
  }

  HandleProfileSubmit(){
    if(ValidateForm.call(this)){
      this.setState({error:""})

      API.SendPost('user-update', {
        auth: this.props.auth,
        user:{
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          image: this.state.image
        }
      })
      .then((res) => this.props.SetAuth(res.auth, res.user))
      .catch(error => SetError.call(this, error.toString(), 2))
    }
  }

  ResetErrorShakeTimer(){
    window.clearTimeout(this.errorShakeTimer)
    this.errorShakeTimer = window.setTimeout(()=>this.setState({errorShake: false}), 100)
  }

  render() {
    let {page, error, errorShake, errorLevel} = this.state
    let {auth, user} = this.props

    if(auth && (!user || !user.firstName || !user.image)) page = 'profile'

    switch(page) {
      case "login":
        page = (
          <div className="login-container">
            <TextInput value={this.state.email} placeholder="Email" onChange={(e)=>ChangeField.call(this, e.target.value, "email")}/>
            <TextInput value={this.state.password} placeholder="Password" onChange={(e)=>ChangeField.call(this, e.target.value, "password")}/>
            <Button value="Log In" primary onClick={this.HandleLogin.bind(this)}/>
            <Button value="Facebook Login" primary style={{background: '#09A8E3'}} />
            <Button value="Google Login" style={{background: '#959595', color: 'white'}} />
            <Button value="Signup" noBack onClick={()=>this.setState({page:"signup"})}/>
          </div>
        )
      break;

      case "signup":
        page = (
          <div className="signup-container">
            <TextInput value={this.state.email} placeholder="Email" onChange={(e)=>ChangeField.call(this, e.target.value, "email")}/>
            <TextInput value={this.state.password} placeholder="Password" onChange={(e)=>ChangeField.call(this, e.target.value, "password")}/>
            <TextInput value={this.state.passwordConfirm} placeholder="Password Confirm" onChange={(e)=>ChangeField.call(this, e.target.value, "passwordConfirm")}/>
            <Button value="Sign Up" primary onClick={this.HandleSignup.bind(this)} />
            <Button value="Log In" noBack onClick={()=>this.setState({page:"login"})}/>
          </div>
        )
      break;

      case "profile":
        page = (
          <div className="profile-container">
            <img src={this.state.image} className="profile-image-submit" alt="profile"/>
            <TextInput value={this.state.firstName} placeholder="First Name" onChange={(e)=>ChangeField.call(this, e.target.value, "firstName")}/>
            <TextInput value={this.state.lastName} placeholder="Last Name" onChange={(e)=>ChangeField.call(this, e.target.value, "lastName")}/>
            <Button value="Create Profile" primary onClick={this.HandleProfileSubmit.bind(this)}/>
          </div>
        )
      break;

      default:
    }

    return (
      <div className="Auth">
        <img className="logo" src="/doko-logo.svg" alt="logo"/>
        <div className="inner-container">
          <Error error={error} level={errorLevel} shake={errorShake}/>
          {page}
        </div>
      </div>
    )
  }

}

export default Auth

function ChangeField(string, field){
  this.setState({[field]: string})
}

function ValidateForm(){
  let {page, email, password, passwordConfirm, firstName, lastName} = this.state

  switch(page){
    case "login":
      if(email === "" || password === "") return SetError.call(this, "Fields cannot be blank", 1)
    return true

    case "signup":
      if(password !== passwordConfirm) return SetError.call(this, "Passwords dont match.", 1)
      if(email === "" || password === "" || passwordConfirm === "") return SetError.call(this, "Fields cannot be blank", 1)
    return true

    case "profile":
      if(firstName === "" || lastName === "") return SetError.call(this, "Fields cannot be blank", 1)
    return true

    default: return true
  }
}

function SetError(errorString, errorLevel){
  console.log(errorString, errorLevel)
  this.setState({error: errorString, errorShake: true, errorLevel})
  this.ResetErrorShakeTimer()
  return false
}
