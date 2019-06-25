module.exports = (app) => {
  app.post("/fb-login", (req, res) => {
    //authenticate the fb token.
    app.db.functions.checkFBToken(req.body.accessToken)
    .then(token => {
      if(!token.is_valid) throw new Error("Invalid Token")

      else return app.db.functions.checkFBID(req.body.userID)
    })
    //verify searches user db for an email match.
    //if a user account wasnt found with googleID, search email
    .then(user => user ? user : app.db.functions.verify(req.body.email))
    //if no user still, then create one, if a user was found, update it with googleUserID
    .then(user => {
      console.log("user", user, req.body)
      return user ? (
        user.fbUserID ? user : app.db.schemas.User.findOneAndUpdate({_id: user._id}, {
          $set:{fbUserID: req.body.userID}
        })
      ):(
        app.db.functions.createUser({
          name: req.body.name,
          email: req.body.email,
          fbUserID: req.body.userID,
          image: req.body.imageURL
        })
      )
    })
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
