import React from 'react'
import './Pages.css'

import LogoutIcon from '../../../display/Icons/LogoutIcon'
import TextInput from '../../TextInput/TextInput'
import Button from '../../Button/Button'
import ImageUpload from '../../ImageUpload/ImageUpload'

const SettingsPage = ({
    auth, user, image, onImageChange, email, onEmailChange, password, onPasswordChange,
    passwordConfirm, onPasswordConfirmChange,
    firstName, onFirstNameChange, lastName, onLastNameChange,
    onSubmit, onLogout, HandleError, loading, success
}) => (
  <div className="settings-page home-ui-page">
    <h1 className="home-ui-title">User Settings</h1>

    <label className="home-ui-label" htmlFor="settings-page-image-upload">Change Profile Image.</label>
    <ImageUpload
      id="settings-page-image-upload"
      auth={auth}
      image={user.image}
      endpoint='/user-image-upload'
      onSuccess={(data)=>onImageChange(data.url)}
      onError={(err)=>HandleError(err, 2)}
    />

    <label className="home-ui-label" htmlFor="settings-page-email">Change Email.</label>
    <TextInput id="settings-page-email" className="home-ui-input" value={email} onChange={onEmailChange} placeholder={user.email} />

    <label className="home-ui-label" htmlFor="settings-page-password">Change Password</label>
    <TextInput id="settings-page-password" type="password" className="home-ui-input" value={password} onChange={onPasswordChange} placeholder="***" />
    <TextInput id="settings-page-password-confirm" type="password" className="home-ui-input" value={passwordConfirm} onChange={onPasswordConfirmChange} placeholder="***" />

    <label className="home-ui-label" htmlFor="settings-page-first-name">Change Name</label>
    <TextInput id="settings-page-first-name" className="home-ui-input" value={firstName} onChange={onFirstNameChange} placeholder={user.name.split(" ")[0]} />
    <TextInput id="settings-page-last-name" className="home-ui-input" value={lastName} onChange={onLastNameChange} placeholder={user.name.split(" ")[1]} />

    <Button
      primary
      value="Update profile"
      onClick={onSubmit}
      loading={loading}
      success={success}
    />

    <Button
      noBack
      svgIcon={<LogoutIcon color="#bcbcbc" />}
      value="Log Out"
      style={{color: "#bcbcbc"}}
      onClick={onLogout}
    />
  </div>
)

export default SettingsPage
