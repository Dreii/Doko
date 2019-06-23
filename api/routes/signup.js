module.exports = (app) => {
  app.post("/signup", (req, res) => {
    return app.db.functions.verify(req.body.email)
    .then(user => {
      if(user){
        throw new Error("User already exists.")
      }else{
        return app.db.functions.createUser({
          email: req.body.email,
          password: app.bcrypt.hashSync(req.body.password, 8)
        })
      }
    })
    .then((user) => {
      var token = app.jwt.sign({ _id: user._id, email: user.email, password: user.password }, process.env.JWT_SECRET, {
        expiresIn: 86400 // expires in 24 hours
      })
      res.status(200).json({message: "success", token, user})
    })
    .catch((error) => {
      res.status(401).send({error: error.message})
    });
  })
}
