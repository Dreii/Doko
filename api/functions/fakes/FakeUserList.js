const iRandomRange = require('../helpers').iRandomRange
const GenerateRandomProfile = require('../helpers').GenerateRandomProfile

module.exports = (app) => {
  if(!app.DEBUG) return []

  let members = []
  for(let j=0;j<iRandomRange(10, 100);j++){members.push(GenerateRandomProfile(j))}
  return members
}
