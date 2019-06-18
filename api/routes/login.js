module.exports = (app) => {
  app.post("/login", (req, res) => {
    return app.db.functions.verify(req.body.email)
    .then(user => {
      if(user) return app.db.functions.authenticate(user, req.body.password)
      else throw new Error("No user with that email.")
    })
    .then(user => {
      if(user){
        var token = app.jwt.sign({ _id: user._id, email: user.email, password: user.password }, process.env.JWT_SECRET, {
          expiresIn: 86400 // expires in 24 hours
        });
        res.json({message: "success", token, user})
      }
      else{
        throw new Error("No user with that email.")
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(401).send({ error: error.message })
    })
  })
}
