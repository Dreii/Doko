module.exports = app => {
  app.post('/user-update', async function(req, res){
    console.log(req.body)
    try{
      if(!req.body.auth) return res.status(404).send("Not Authorized")

      let decoded = app.jwt.verify(req.body.auth, process.env.JWT_SECRET)
      let old = await app.db.schemas.User.findOne({_id: decoded._id}).lean()

      let password = req.body.user.password ? app.bcrypt.hashSync(req.body.user.password, 8) : old.password

      let update = {...old, ...req.body.user, password}
      let user = await app.db.schemas.User.findOneAndUpdate({_id: decoded._id}, update, {new: true, projection: 'email name image'}).exec()

      let token = app.jwt.sign({ _id: user._id, email: user.email, password: user.password }, process.env.JWT_SECRET, {
        expiresIn: 86400 // expires in 24 hours
      })

      console.log(user)
      res.status(200).json({msg: "user updated", token, user})
    }catch(err){
      console.log(err)
      res.status(500).json(err.message)
    }
  })
}
