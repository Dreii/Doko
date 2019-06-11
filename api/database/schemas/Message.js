var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
  name: "Message",
  model:{
    message: {type: String, default: ''},
    room: {type: Schema.Types.ObjectId, ref: 'Room'},
    sender: {type: Schema.Types.ObjectId, ref: 'User'},
    created_at: {type: Date},
    updated_at: {type: Date}
  }
}
