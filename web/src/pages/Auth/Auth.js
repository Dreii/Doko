import React, { Component } from 'react'

// Load Styles for the Auth page.
import './Auth.css'

//Error display component.
import Error from '../../components/display/Error/Error'

//Form components.
import Login from './Login'
import Signup from './Signup'
import ProfileSetup from './ProfileSetup'

//Decorative component.
import CityBackgroundDisplay from './CityBackgroundDisplay'

//import the API controller to get functions for authorizing against the api.
import API from '../../functions/api'

class Auth extends Component {
  state = {
    page: "login", // Page switches between login, signup and profile, for each stage of profile setup and auth.
    email: "", // Holds input for email fields.
    password: "", // Holds input for password fields.
    passwordConfirm: "", // Holds input for the password confirm field.
    firstName: "", // Holds input for the first name field.
    lastName: "", // Holds input for the last name field.
    image: "", // Holds URL of profile image once set.
    error: "", // Error string to be displayed.
    errorShowing: false, //whether the error should display or not.
    errorLevel: 0, //The intensity of the error, 0 for message, 1 for warning, 2 for error.
    formTarget: "", //Target for success and loading states on the form
    formLoading: false, //whether or not to show a loading state on target form button
  }

  //Validates login form, and sends a login request to the server,
  //processes the response and either sets the auth key and profile or displays an error.
  HandleLogin = () => {
    if(this.ValidateForm()){
      this.SetLoading(true, "login")
      //SendPost returns a promise so we can manipulate the response.
      API.SendPost('login', {email: this.state.email, password: this.state.password})
      .then((res)=> {
        this.props.SetAuth(res.token, res.user)
      })
      .catch(error => this.SetError(error.message, 2))
    }
  }

  HandleFacebookLogin = (data) => {
    if(!data || !data.accessToken) return this.SetError('Facebook authentication denied', 1)
    let filteredData = {accessToken: data.accessToken, userID: data.userID, email: data.email, name: data.name, imageURL: data.picture.data.url}

    API.SendPost('fb-login', filteredData)
    .then((res) => {
      this.props.SetAuth(res.token, res.user)
    })
    .catch(error => this.SetError(error.message, 2))
  }

  HandleGoogleLogin = (data) => {
    if(!data.tokenId) return this.SetError('Google authentication denied', 1)

    let filteredData = {accessToken: data.tokenId, userID: data.googleId, email: data.profileObj.email, name: data.profileObj.name, imageURL: data.profileObj.imageUrl}
    API.SendPost('google-login', filteredData)
    .then((res) => {
      this.props.SetAuth(res.token, res.user)
    })
    .catch(error => {
      console.error(error)
      this.SetError(error.message, 1)}
    )
  }

  //Validates signup form, and sends a signup request to the server,
  //processes the response and either sets the auth key and profile or displays an error.
  HandleSignup = () => {
    if(this.ValidateForm()){
      this.SetLoading(true, "signup")

      //SendPost returns a promise so we can manipulate the response.
      API.SendPost('signup', {email: this.state.email, password: this.state.password})
      .then((res)=> {
        this.props.SetAuth(res.token, res.user)
        this.SetLoading(false)
        this.ChangePage('profile')
      })
      .catch(error => this.SetError(error.message, 2))
    }
  }

  //Validates profile setup form, and sends a user update request to the server,
  //processes the response and either sets the updated profile data or displays an error.
  HandleProfileSubmit = () => {
    if(this.ValidateForm()){
      this.SetLoading(true, "update-profile")
      //SendPost returns a promise so we can manipulate the response.
      API.SendPost('user-update', {
        auth: this.props.auth,
        user:{
          name: this.state.firstName + " " + this.state.lastName
        }
      })
      .then((res) => {
        this.props.SetAuth(res.auth, res.user)
      })
      .catch(error => this.SetError(error.toString(), 1))
    }
  }

  //Set the error string, and level, then begin the shake animation and a timer to stop it.
  SetError = (errorString, errorLevel) => {
    console.error(errorString)
    this.setState({error: errorString, errorShowing: true, errorLevel, formLoading: false})
    window.clearTimeout(this.loadingTimer)

    //begin shake animation timer.
    window.clearTimeout(this.errorFadeTimer)
    this.errorFadeTimer = window.setTimeout(()=>this.setState({errorShowing: false}), 1500)

    //return false so that we can block form processing (check ValidateForm function).
    return false
  }

  //Check for error cases on each page and throw errors when one is true.
  //SetError returns false so it can block form processing.
  ValidateForm = () => {
    //pull out variables for easy access.
    let {page, email, password, passwordConfirm, image, firstName, lastName} = this.state

    //make sure there are no blank fields on the login page.
    if(page === "login" && (email === "" || password === "")) return this.SetError("Fields cannot be blank", 0)

    //make sure there are no blank fields on the Signup page and that the password confirm field is the same as password.
    //Also make sure that passwords are at least 5 characters long and contain letters and numbers.
    if(page === "signup" && (email === "" || password === "" || passwordConfirm === "")) return this.SetError("Fields cannot be blank", 0)
    if(page === "signup" && email.match(/^\S+@\S+[.][0-9a-z]+$/) === null) return this.SetError("Invalid email", 0)
    if(page === "signup" && password !== passwordConfirm) return this.SetError("Passwords dont match", 0)
    if(page === "signup" && password.length < 4) return this.SetError("Password too short", 0)
    if(page === "signup" && password.match(/([0-9].*[a-zA-Z])|([a-zA-Z].*[0-9])/) === null) return this.SetError("Password needs letters and numbers", 0)

    //make sure there are no blank fields on the profile setup page.
    if(page === "profile" && (image === "" || firstName === "" || lastName === "")) return this.SetError("Fields cannot be blank", 0)
    //if no errors have been found return true to confinue processing the form.
    return true
  }

  //Change one of the input fields in the form.
  ChangeField = (string, field) => this.setState({[field]: string})

  //Switch pages between login and signup
  ChangePage = (page) => page === "login" || page === "signup" || page === "profile" ? this.setState({page: page}) : this.SetError("Invalid Page.", 2)

  //return xpos that the outer container should translate to; 0 for login, -100% for signup, -200% for Profile
  //this allows the ui to slide to the left and right when changing pages.
  GetPageXPos = (page) => page === "login" ? 0 : page === "signup" ? 100 : 200

  SetLoading = (formLoading, formTarget) => {
    if(formLoading){
      //begin loading timer.
      window.clearTimeout(this.loadingTimer)
      this.loadingTimer = window.setTimeout(()=>{
        this.setState({formLoading: false})
        this.SetError("Server Timed out", 2)
      }, 15000)
    }else{
      window.clearTimeout(this.loadingTimer)
    }
    this.setState({formLoading, formTarget})
  }

  HandleEnterPressed = (e) => {
    if(e.key !=='Enter') return

    let {page, formLoading} = this.state
    if(!formLoading){
      if(page === "login") this.HandleLogin()
      if(page === "signup") this.HandleSignup()
      if(page === "profile") this.HandleProfileSubmit()
    }
  }

  componentDidMount(){window.addEventListener('keyup', this.HandleEnterPressed)}
  componentWillUnmount(){
    window.removeEventListener('keyup', this.HandleEnterPressed)
    window.clearTimeout(this.errorFadeTimer)
    window.clearTimeout(this.loadingTimer)
  }

  render() {
    // extract variables from state and props for easy acess
    let {page, error, errorShowing, errorLevel, email, password, passwordConfirm, firstName, lastName, image, formTarget, formLoading} = this.state
    let {auth, user} = this.props

    //default the page to profile if the name or image data is not set but everything else is.
    if(auth && user && (!user.name || !user.image)) page = 'profile'

    return (
      <div className="Auth">
        <img className="logo" src="/doko-logo.svg" alt="logo" />
        <Error error={error} level={errorLevel} show={errorShowing} />
        {/* translate the outer-container X when page changes to slide UI around. */}
        <div className="outer-container" style={{transform: `translateX(-${this.GetPageXPos(page)}vw)`}}>

          {/* Handles login inputs. */}
          <Login
            email={email}
            password={password}
            ChangeField={this.ChangeField}
            HandleLogin={this.HandleLogin}
            HandleFacebookClick={() => {this.SetLoading(true, "fb-login")}}
            HandleFacebookLogin={this.HandleFacebookLogin}
            HandleGoogleClick={() => this.SetLoading(true, "g-login")}
            HandleGoogleLogin={this.HandleGoogleLogin}
            ChangePage={this.ChangePage}
            HandleError={this.SetError}
            loginLoading={formTarget === "login" && formLoading}
            fbLoginLoading={formTarget === "fb-login" && formLoading}
            gLoginLoading={formTarget === "g-login" && formLoading}
          />

          {/* Handles signup inputs. */}
          <Signup
            email={email}
            password={password}
            passwordConfirm={passwordConfirm}
            ChangeField={this.ChangeField}
            HandleSignup={this.HandleSignup}
            ChangePage={this.ChangePage}
            loading={formTarget === "signup" && formLoading}
          />

          {/* Handles profile image upload as well as name inputs. */}
          <ProfileSetup
            auth={auth}
            image={image}
            SetImage={(image) => this.setState({image})}
            firstName={firstName}
            lastName={lastName}
            ChangeField={this.ChangeField}
            HandleProfileSubmit={this.HandleProfileSubmit}
            HandleError={this.SetError}
            loading={formTarget === "profile-update" && formLoading}
          />
        </div>

        {/* A display component that shows a city in the background of the auth page, using the page scroll for parallax. */}
        <CityBackgroundDisplay parallaxX={this.GetPageXPos(page)} />
      </div>
    )
  }

}
export default Auth
