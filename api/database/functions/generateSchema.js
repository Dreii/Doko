const mongoose = require('mongoose');

module.exports = (modelName, modelObject, modelIndexes, ...middleware) => {
  const Schema = mongoose.Schema

  const NewSchema = new Schema(modelObject)

  NewSchema.pre('save', function(next){
    let currentDate = new Date()
    this.updated_at = currentDate
    if (!this.created_at)
      this.created_at = currentDate

    next()
  })

  modelIndexes && modelIndexes.forEach(modelIndex => {
    NewSchema.index({[modelIndex.field]:modelIndex.value})
  })

  return mongoose.model(modelName, NewSchema)
}
