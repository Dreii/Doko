//Link to the image CDN, for easy access.
const mediaCDN = 'https://media.dokomap.io/'

module.exports = app => {
  app.post('/image-upload',
  //authenticate auth header.
  require('../functions/CheckAuthToken')(app),
  //use Multer to upload a single file, with the key being the uploaders userID + a timestamp.
  app.ImageUpload.single('file'),
  //look for any old images in our media bucket and clean them out, then apply this image to the user in db.
  async function(req, res, next){
    let user = await app.db.schemas.User.findOne({_id: req.res.locals.id})
    if(user && user.image){
      let index = user.image.indexOf(mediaCDN)+mediaCDN.length,
          key = index !== -1 ? user.image.substr(index):null

      if(key !== null) app.ImageUpload.delete(key)
    }

    await app.db.schemas.User.findOneAndUpdate({_id: req.res.locals.id}, {$set: {image: mediaCDN+req.file.key}})

    return res.status(200).send({msg: "image uploaded", url: mediaCDN+req.file.key})
  })
}
