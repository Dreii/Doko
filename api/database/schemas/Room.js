var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
  name: "Room",
  indexes: [{field: "location", value: "2d"}],
  model:{
    location: [Number], //[long, lat]
    name: {type: String, default: ''},
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    created_at: {type: Date},
    updated_at: {type: Date}
  }
}
