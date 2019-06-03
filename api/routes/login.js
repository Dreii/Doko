module.exports = (app) => {
  app.post("/login", (req, res) => {
    return app.db.functions.verify(req.body.email)
    .then(user => {
      if(user) return app.db.functions.authenticate(user, req.body.password)
      else throw new Error("A user with that email doesn't exist.")
    })
    .then(user => {
      if(user){
        var token = app.jwt.sign({ _id: user._id, email: user.email, password: user.password }, app.JWTSECRET, {
          expiresIn: 86400 // expires in 24 hours
        });
        res.json({message: "success", token, user})
      }
      else{
        throw new Error("No user found with that email and password.")
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(401).json({ error: error.message })
    })
  })
}