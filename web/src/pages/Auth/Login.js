//refer to Auth.js for context on what this component does.

import React from 'react'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import GoogleLogin from 'react-google-login'

import TextInput from '../../components/inputs/TextInput/TextInput'
import Button from '../../components/inputs/Button/Button'

const Login = ({email, password, ChangeField, HandleLogin, HandleFacebookLogin, HandleGoogleLogin, HandleError, ChangePage}) => {
  return (
    <div className="login-container">
      <TextInput value={email} placeholder="Email" onChange={(e)=>ChangeField(e.target.value, "email")}/>
      <TextInput value={password} type="password" placeholder="Password" onChange={(e)=>ChangeField(e.target.value, "password")}/>

      <Button value="Log In" primary onClick={HandleLogin} />

      <FacebookLogin
        appId={process.env.REACT_APP_FBAPPID}
        fields="name,email,picture.type(large)"
        callback={(data)=> HandleFacebookLogin(data)}
        render={renderProps => (
          <Button value="Facebook Login" icon="/facebook-icon.svg" className="facebook-login-button" onClick={renderProps.onClick} />
        )}
      />

      <GoogleLogin
        clientId={process.env.REACT_APP_GAPPID}
        onSuccess={(data)=> HandleGoogleLogin(data)}
        onFailure={(err)=> HandleError(err, 2)}
        render={renderProps => (
          <Button value="Google Login" icon="/google-icon.svg" className="google-login-button" onClick={renderProps.onClick} />
        )}
      />

      <Button value="Signup" noBack onClick={()=>ChangePage("signup")}/>
    </div>
  )
}

export default Login
