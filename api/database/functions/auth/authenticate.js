var bcrypt = require('bcryptjs')

module.exports = (self) => (user, password) => {
  // console.log("allo", bcrypt.compareSync(password, user.password))
  if(user && bcrypt.compareSync(password, user.password)) return user
  else {
    throw new Error("Wrong username or password")
  }
}
