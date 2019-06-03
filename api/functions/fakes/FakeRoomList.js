const iRandomRange = require('../helpers').iRandomRange
const randomInArray = require('../helpers').randomInArray
const LoremIpsum = require('lorem-ipsum').LoremIpsum
const lorem = new LoremIpsum()

module.exports = (app) => {
  if(!app.DEBUG) return []

  let chatCount = iRandomRange(3, 10)
  let rooms = []
  let creator = randomInArray(app.userList).id

  for(let i=0; i<chatCount; i++){
    rooms.push({
      id: i,
      latitude: 0,
      longitude: 0,
      name: lorem.generateWords(iRandomRange(3, 5)),
      creator,
    })
  }

  return rooms
}
