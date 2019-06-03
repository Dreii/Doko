const iRandomRange = require('../helpers').iRandomRange
const randomInArray = require('../helpers').randomInArray
const LoremIpsum = require('lorem-ipsum').LoremIpsum
const lorem = new LoremIpsum()

module.exports = (app) => {
  if(!app.DEBUG) return []

  let messages = []
  for(let k=0;k<iRandomRange(1, 200);k++){
    messages.push({
      room: randomInArray(app.roomList).id,
      sender: randomInArray(app.userList).id,
      message: lorem.generateWords(iRandomRange(1, 20)),
    })
  }
  return messages
}
