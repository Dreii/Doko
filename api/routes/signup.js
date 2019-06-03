module.exports = (app) => {
  app.post("/signup", (req, res) => {
    console.log(req.body)
    return app.db.functions.verify(req.body.email)
    .then(user => {
      console.log("verified", user)
      if(user){
        throw new Error("User already exists.")
      }else{
        return app.db.functions.createUser({
          email: req.body.email,
          password: app.bcrypt.hashSync(req.body.password, 8),
        })
      }
    })
    .then((user) => {
      console.log("created", user)
      var token = app.jwt.sign({ _id: user._id, email: user.email, password: user.password }, app.JWTSECRET, {
        expiresIn: 86400 // expires in 24 hours
      })
      res.status(200).json({message: "success", token, user})
    })
    .catch((error) => {
      res.status(401).json({error: error.message})
    });
  })
}
