const express = require("express")
const app = express()

const cors = require('cors')
const whitelist = ['https://localhost:3000', 'https://dokomap.io', 'https://www.dokomap.io', 'https://media.dokomap.io', 'https://api.dokomap.io']
const corsOptions = {
  origin: function (origin, callback) {
    if(!origin) return callback(null, true);

    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      console.log('Not allowed by CORS')
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))

//Set how request body's are parsed.
app.bodyParser = require('body-parser')
app.use(app.bodyParser.json())
app.use(app.bodyParser.urlencoded({
  extended: true
}))
app.use((error, req, res, next) => res.status(500).send(error))

//configure authentication tools
app.jwt = require('jsonwebtoken')
app.bcrypt = require('bcryptjs')
process.env.JWT_SECRET = process.env.JWT_SECRET

//configure image upload controller
app.ImageUpload = require('./ImageUpload')

//setup database
app.mongoose = require('mongoose')
app.mongoose.set('useFindAndModify', false)
app.mongoose.Promise = Promise
app.db = require("../database/database-controller")
app.db.init()

//add fakes if in debug mode
if(process.env.DEBUG === "true"){
  //fake data for testing
  require('./fakes/AddFakes')(app)
}

//setup routes
require('../routes/login')(app)
require('../routes/fb-login')(app)
require('../routes/google-login')(app)
require('../routes/signup')(app)
require('../routes/user-update')(app)
require('../routes/image-upload')(app)
require('../routes/search-location')(app)
require('../routes/hello')(app)

//setup Socket.
app.io = require('../socket/socket-controller')
app.io.connect(app.db)


app.set("port", process.env.PORT || 3001)

//Set defaults for error handling.
process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.error('unhandledRejection', error)
})

module.exports =  app
