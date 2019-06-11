module.exports = (self) => (googleUserID) => {
  return self.schemas.User.findOne({googleUserID}).exec()
}
