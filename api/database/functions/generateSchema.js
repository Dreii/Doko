const mongoose = require('mongoose');

module.exports = (modelName, modelObject, modelIndexes, ...middleware) => {
  const Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId

  const NewSchema = new Schema(modelObject)

  NewSchema.pre('save', function(next){
    let currentDate = new Date()
    this.updated_at = currentDate
    if (!this.created_at)
      this.created_at = currentDate

    next()
  })

  modelIndexes && modelIndexes.forEach(modelIndex => {
    // NewSchema.createIndex({[modelIndex.field]:modelIndex.value})
    NewSchema.index({[modelIndex.field]:modelIndex.value})
  })

  return mongoose.model(modelName, NewSchema)
}
