//Link to the image CDN, for easy access.
const mediaCDN = 'https://media.dokomap.io/'

const Authenticate = (app) => (req, res, next) => {
  let decoded, error

  //if no auth header supplied return error.
  if(!req.headers.auth) error = {error: "Not Authorized"}
  //verify auth header.
  else try{decoded = app.jwt.verify(req.headers.auth, process.env.JWT_SECRET)}
  catch(err){error = err}

  if(error) res.status(401).send({error: "Not Authorized"})
  else{
    res.locals.id = decoded._id
    next()
  }
}

module.exports = app => {
  app.post('/image-upload',
  //authenticate auth header.
  Authenticate(app),
  //use Multer to upload a single file, with the key being the uploaders userID + a timestamp.
  app.ImageUpload.single('file'),
  //look for any old images in our media bucket and clean them out, then apply this image to the user in db.
  async function(req, res, next){
    let user = await app.db.schemas.User.findOne({_id: req.res.locals.id})
    if(user && user.image){
      let index = user.image.indexOf(mediaCDN),
          key = index !== -1 ? user.image.substr(index):null

      if(key !== null) app.ImageUpload.delete(key)
    }

    await app.db.schemas.User.findOneAndUpdate({_id: req.res.locals.id}, {$set: {image: mediaCDN+req.file.key}})

    return res.status(200).json({msg: "image uploaded", url: mediaCDN+req.file.key})
  })
}
