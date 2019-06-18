import React from 'react'

//refer to Auth.js for documentation on what this component does.

import TextInput from '../../components/inputs/TextInput/TextInput'
import Button from '../../components/inputs/Button/Button'

const Signup = ({email, password, passwordConfirm, HandleSignup, ChangeField, ChangePage, loading, success}) => (
  <div className="signup-container">
    <TextInput value={email} placeholder="Email" onChange={(e)=>ChangeField(e.target.value, "email")}/>
    <TextInput value={password} type="password" placeholder="Password" onChange={(e)=>ChangeField(e.target.value, "password")}/>
    <TextInput value={passwordConfirm} type="password" placeholder="Password Confirm" onChange={(e)=>ChangeField(e.target.value, "passwordConfirm")}/>
    <Button value="Sign Up" primary onClick={HandleSignup} loading={loading} success={success} />
    <Button value="Log In" noBack onClick={()=>ChangePage("login")}/>
  </div>
)

export default Signup
