export default function ValidateForm(page){
  let {changeEmail, changePassword, changePasswordConfirm, changeFirstName, changeLastName} = this.state

  //empty fields
  if(page === "profile-edit" && (changeEmail.length === 0 && changePassword.length === 0 && changeFirstName.length === 0 && changeLastName.length === 0))
    return this.props.HandleError("Nothing to update", 0)

  //email validation
  if(page === "profile-edit" && changeEmail.length && changeEmail.match(/^\S+@\S+[\.][0-9a-z]+$/) === null)
    return this.props.HandleError("Invalid email", 0)

  //password length validation
  if(page === "profile-edit" && changePassword.length && changePassword.length < 4)
    return this.props.HandleError("Password too short", 0)

  //password complexity validation
  if(page === "profile-edit" && changePassword.length && changePassword.match(/([0-9].*[a-zA-Z])|([a-zA-Z].*[0-9])/) === null)
    return this.props.HandleError("Password requires at least one letter and one number", 0)

  //password match validation
  if(page === "profile-edit" && changePassword.length
    && changePassword !== changePasswordConfirm)
    return this.props.HandleError("Passwords dont match", 0)


  return true
}
