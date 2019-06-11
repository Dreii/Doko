var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
  name: "Room",
  indexes: [{field: "location", value: "2dsphere"}],
  model:{
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    name: {type: String, default: ''},
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    created_at: {type: Date},
    updated_at: {type: Date}
  }
}
