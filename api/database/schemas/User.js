var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
  name: "User",
  model:{
    firstName: {type: String, default: ''},
    lastName: {type: String, default: ''},
    email: {type: String, default: '', unique: true},
    password: {type: String},
    image: {type: String, default: ""},
    fbUserID: {type: String, default:''},
    fbAccessToken: {type: String, default :''},
  }
}
