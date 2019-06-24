//refer to Auth.js for context on what this component does.

import React from 'react'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
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

        <FacebookLogin
          appId={process.env.REACT_APP_FBAPPID}
          fields="name,email,picture.type(large)"
          callback={(data)=> HandleFacebookLogin(data)}
          redirectUri={'https://dokomap.io'}
          onClick={HandleFacebookClick}
          render={renderProps => (
            <Button value="Facebook Login" primary loading={fbLoginLoading} icon="/facebook-icon.svg" className="facebook-login-button" onClick={renderProps.onClick} />
          )}
        />

        <GoogleLogin
          clientId={process.env.REACT_APP_GAPPID}
          onSuccess={(data)=> HandleGoogleLogin(data)}
          onFailure={(err)=> HandleError(err.error, 2)}
          render={renderProps => (
            <Button value="Google Login" primary loading={gLoginLoading} icon="/google-icon.svg" className="google-login-button" onClick={(e)=>{HandleGoogleClick(); renderProps.onClick(e)}} />
          )}
        />

        <Button className="signup-toggle" value="Signup" noBack onClick={()=>ChangePage("signup")}/>
      </div>
    </div>
  )
}

export default Login
