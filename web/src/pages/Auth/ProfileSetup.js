import React from 'react'

//refer to Auth.js for documentation on what this component does.

import ImageUpload from '../../components/inputs/ImageUpload/ImageUpload'
import TextInput from '../../components/inputs/TextInput/TextInput'
import Button from '../../components/inputs/Button/Button'

const Profile = ({auth, image, SetImage, firstName, lastName, ChangeField, HandleProfileSubmit, HandleError, loading, success}) => {
  return(
    <div className="profile-container">
      <ImageUpload auth={auth} image={image} endpoint='/user-image-upload' onSuccess={(data)=>SetImage(data.url)} onError={(err)=>HandleError(err)}/>

      <TextInput value={firstName} placeholder="First Name" onChange={(e)=>ChangeField(e.target.value, "firstName")}/>
      <TextInput value={lastName} placeholder="Last Name" onChange={(e)=>ChangeField(e.target.value, "lastName")}/>
      <Button value="Create Profile" primary onClick={HandleProfileSubmit} loading={loading} success={success} />
    </div>
  )
}

export default Profile
