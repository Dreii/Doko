var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
  name: "Room",
  indexes: [{field: "location", value: "2d"}],
  model:{
    location: [Number], //[long, lat]
    name: {type: String, default: ''},
    members: [{type: Schema.Types.ObjectId, ref: 'User'}],
    membersCount: {type: Number, default: 0},
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}],
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    created_at: {type: Date},
    updated_at: {type: Date},
    ownedByUser: {type: Boolean, default: false},
    pinned: {type: Boolean, default: false}
  }
}
