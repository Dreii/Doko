//refer to Auth.js for context on what this component does.

import React from 'react'
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

import { FacebookLogin } from 'react-facebook-login-component';

import GoogleLogin from 'react-google-login'

import TextInput from '../../components/inputs/TextInput/TextInput'
import Button from '../../components/inputs/Button/Button'

const Login = ({
  email, password, ChangeField, HandleLogin,
  HandleFacebookLogin, HandleGoogleLogin,
  HandleError, ChangePage, loginLoading,
  fbLoginLoading, gLoginLoading, HandleFacebookClick,
  HandleGoogleClick
}) => {
  return (
    <div className="login-container">
      <div className="inner-container">
        <TextInput value={email} placeholder="Email" onChange={(e)=>ChangeField(e.target.value, "email")}/>
        <TextInput value={password} type="password" placeholder="Password" onChange={(e)=>ChangeField(e.target.value, "password")}/>

        <Button value="Log In" primary loading={loginLoading} onClick={HandleLogin} />

        {/* <FacebookLogin
          appId={process.env.REACT_APP_FBAPPID}
          fields="name,email,picture.type(large)"
          callback={(data)=> HandleFacebookLogin(data)}
          onClick={HandleFacebookClick}
          render={renderProps => (
            <Button value="Facebook Login" primary loading={fbLoginLoading} icon="/facebook-icon.svg" className="facebook-login-button" onClick={renderProps.onClick} />
          )}
        /> */}
        <FacebookLogin
          socialId={process.env.REACT_APP_FBAPPID}
          language="en_US"
          scope="public_profile,email"
          responseHandler={(data)=> HandleFacebookLogin(data)}
          // xfbml={true}
          fields="id,name,email,picture.type(large)"
          version="v2.5"
          className="button value facebook-login-button"
          buttonText="Login With Facebook"
        />

        <GoogleLogin
          clientId={process.env.REACT_APP_GAPPID}
          onSuccess={(data)=> HandleGoogleLogin(data)}
          onFailure={(err)=> HandleError(err.error, 2)}
          render={renderProps => (
            <Button value="Login With Google" primary loading={gLoginLoading} className="google-login-button" onClick={(e)=>{HandleGoogleClick(); renderProps.onClick(e)}} />
          )}
        />

        <Button className="signup-toggle" value="Signup" noBack onClick={()=>ChangePage("signup")}/>
      </div>
    </div>
  )
}

export default Login
