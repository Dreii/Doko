module.exports = (app) => {
  app.post("/google-login", (req, res) => {
    //authenticate the google token.
    app.db.functions.checkGoogleToken(req.body.accessToken)
    .then(payload => {
      if(!payload) throw new Error("Invalid Token")

      else return app.db.functions.checkGoogleID(req.body.userID)
    })
    //verify searches user db for an email match.
    //if a user account wasnt found with googleID, search email
    .then(user => user ? user : app.db.functions.verify(req.body.email))
    //if no user still, then create one, if a user was found, update it with googleUserID
    .then(user => user ? (
      user.googleUserID ? user : app.db.schemas.User.findOneAndUpdate({_id: user._id}, {
        $set:{googleUserID: req.body.userID}
      })
    ) : (
      app.db.functions.createUser({
        name: req.body.name,
        email: req.body.email,
        googleUserID: req.body.userID,
        image: req.body.imageURL
      })
    ))
    //sign a JWT token for the user
    .then(user => {
      var token = app.jwt.sign({ _id: user._id, email: user.email, password: user.password }, process.env.JWT_SECRET, {
        expiresIn: 86400 // expires in 24 hours
      })
      res.json({message: "success", token, user})
    })
    .catch((error) => {
      console.error(error)
      res.status(401).send({ error: error.message })
    })
  })
}
