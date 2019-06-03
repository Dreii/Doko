module.exports = (self) => (email) => {
  return self.schemas.User.findOne({email}).exec()
}
