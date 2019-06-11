//Get the tools for the job.
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// Set S3 endpoint info
const spacesEndpoint = new aws.Endpoint(process.env.IMAGE_BUCKET_ENDPOINT);
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.IMAGE_ACCESS_KEY_ID,
  secretAccessKey: process.env.IMAGE_SECRET_ACCESS_KEY
})

let ImageUpload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.IMAGE_BUCKET_NAME,
    acl: 'public-read',
    key: (req, file, cb)=>cb(null, req.res.locals.id+Date.now() || file.originalname+Date.now())
  })
})

ImageUpload.delete = (Key)=>{
  console.log("key", Key)
  s3.deleteObject({
    Bucket: process.env.IMAGE_BUCKET_NAME,
    Key
  }, (err, data) => {
    console.log(err, data)
  })
}

module.exports = ImageUpload
