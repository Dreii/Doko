const mongoose = require('mongoose')
module.exports = () => {
  //Set up default mongoose connection
  const mongoDB = 'mongodb://user:!enterD8@ds263146.mlab.com:63146/doko'
  mongoose.connect(mongoDB, { useNewUrlParser: true })
  mongoose.set('useCreateIndex', true)
  // Get Mongoose to use the global promise library
  mongoose.Promise = global.Promise
  //Get the default connection
  const conn = mongoose.connection

  //Bind connection to error event (to get notification of connection errors)
  conn.on('error', console.error.bind(console, 'MongoDB connection error:'))
}
