const mongoose = require('mongoose')
const GenerateRandomColor = require('../../../functions/helpers').GenerateRandomColor
const HashCode = require('../../../functions/helpers').HashCode
module.exports = (self) => async function(data){

  let _id = mongoose.Types.ObjectId()
  let color = GenerateRandomColor(HashCode(_id.toString()))

  let newUser = new self.schemas.User({_id, color, ...data})
  return newUser.save()
}
