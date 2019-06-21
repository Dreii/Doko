var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
  name: "User",
  indexes: [{field: "lastLocation", value: "2dsphere"}],
  model:{
    name: {type: String, default: ''},
    email: {type: String, default: '', unique: true},
    password: {type: String},
    image: {type: String, default: ""},
    fbUserID: {type: String, default:''},
    googleUserID: {type: String, default:''},
    socketID: {type: String, default: ''},
    subscriptions: [{type: Schema.Types.ObjectId, ref: 'Room'}],
    lastLocation:[Number],
    color: {type: String, default: ''},
    online: {type: Boolean, default: false},
    created_at: {type: Date},
    updated_at: {type: Date}
  }
}
