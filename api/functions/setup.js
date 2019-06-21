const express = require("express")
const app = express()

//Set how request body's are parsed.
app.bodyParser = require('body-parser')
app.use(app.bodyParser.json())
app.use(app.bodyParser.urlencoded({
  extended: true
}))
app.use((error, req, res, next) => res.status(500).send(err))

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

//setup Socket.
app.io = require('../socket/socket-controller')
app.io.connect(app.db)


app.set("port", process.env.PORT || 3001)

//Set defaults for error handling.
process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.error('unhandledRejection', error)
})

app.closeDBs = ()=>require('./stopDBs')([app.users, app.rooms, app.messages])
process.on('exit', app.closeDBs)

module.exports =  app
