module.exports = app => {
  app.post('/user-update', async function(req, res){
    try{
      if(!req.body.auth) return res.status(404).send({error: "Not Authorized"})

      let decoded = app.jwt.verify(req.body.auth, process.env.JWT_SECRET)
      let old = await app.db.schemas.User.findOne({_id: decoded._id}).lean()
      let update = {...old, ...req.body.user}
      let user = await app.db.schemas.User.findOneAndUpdate({_id: decoded._id}, update, {new: true}).exec()

      let token = app.jwt.sign({ _id: user._id, email: user.email, password: user.password }, process.env.JWT_SECRET, {
        expiresIn: 86400 // expires in 24 hours
      })

      res.status(200).json({msg: "user updated", token, user})
    }catch(err){
      console.log(err)
      res.status(500).json(err.message)
    }
  })
}
