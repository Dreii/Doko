import API from '../../../functions/api'

export default function ProfileUpdate(){
  let {changeEmail, changePassword, changeFirstName, changeLastName} = this.state

  if(this.ValidateForm("profile-edit")){
    this.setState({formLoading: true, formTarget:'user-update'})

    let newUser = {...this.props.user}
    if(changeEmail) newUser.email = changeEmail
    if(changePassword) newUser.password = changePassword
    if(changeFirstName) newUser.firstName = changeFirstName
    if(changeLastName) newUser.lastName = changeLastName

    let oldName = newUser.name.split(" ")
    if(changeFirstName && changeLastName) newUser.name = changeFirstName + " " + changeLastName
    else if(changeFirstName) newUser.name = changeFirstName + " " + oldName[1]
    else if(changeLastName) newUser.name = oldName[0] + " " + changeLastName

    this.setState({changeEmail:"", changePassword:"", changePasswordConfirm: "", changeFirstName: "", changeLastName:""})

    //SendPost returns a promise so we can manipulate the response.
    API.SendPost('user-update', {
      auth: this.props.auth,
      user: newUser
    })
    .then((res) => {
      this.SetSuccess()
      this.props.SetAuth(res.token, res.user)
    })
    .catch(error => {
      this.props.HandleError(error.toString(), 2)
      this.setState({loading: false})
    })
  }
}
