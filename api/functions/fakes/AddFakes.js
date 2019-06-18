const iRandomRange = require('../helpers').iRandomRange
const RandomRange = require('../helpers').RandomRange
const randomInArray = require('../helpers').randomInArray

const LoremIpsum = require('lorem-ipsum').LoremIpsum
const lorem = new LoremIpsum()

//Link to the image CDN, for easy access.
const mediaCDN = 'https://media.dokomap.io/'

module.exports = async function AddFakes(app){
  let users = app.db.schemas.User.find()
  let rooms = app.db.schemas.Room.find()
  let messages = app.db.schemas.Message.find()

  let group = await Promise.all([users, rooms, messages])

  let userCount = group[0].length,
      roomCount = group[1].length,
      messageCount = group[2].length

  if(userCount < 10){
    let fakeUsers = []
    for(let i=0;i<iRandomRange(10, 100);i++){
      let image = mediaCDN+randomInArray(['person-1.png', 'person-2.png', 'person-3.png', 'person-4.png', 'person-5.png', 'person-6.png', 'person-7.png', 'person-8.png', 'person-9.png']),
          firstName = randomInArray(['Ashley', 'Skye', 'Matt', 'Mat', 'Brooke Lynne', 'Logan ', 'Thomas', 'Ian', 'Hunter', 'Adrienne', 'Nathan', 'Sean', 'Stephen']),
          lastName = randomInArray(['Aoki', 'Jenkins', 'Inglis', 'Kumar', 'Alcuran', 'Alcott', 'Baldwin', 'Ross', 'Thompson', 'Wilson', 'Char', 'Verhaagen', 'Colbert']),
          name = firstName + ' ' + lastName,

          email = `email${i}@test.com`,
          password = "testpassword"

      fakeUsers.push({email, password, image, name, created_at: new Date()})
    }

    await app.db.schemas.User.insertMany(fakeUsers)
  }

  if(roomCount < 1){
    let users = await app.db.schemas.User.find()
    let fakeRooms = []
    for(let i=0; i<iRandomRange(10, 15); i++){
      fakeRooms.push({
        location: [
          RandomRange(-97.717556, -97.785877),
          RandomRange(30.21338, 30.314794)
        ],
        name: lorem.generateWords(iRandomRange(3, 5)),
        creator: randomInArray(users)._id,
        created_at: new Date(),
      })
    }

    app.db.schemas.Room.insertMany(fakeRooms)
  }

  if(messageCount < 1){
    let users = await app.db.schemas.User.find()
    let rooms = await app.db.schemas.Room.find()

    let fakeMessages = []
    for(let k=0;k<iRandomRange(50, 100);k++){
      fakeMessages.push({
        room: randomInArray(rooms).id,
        sender: randomInArray(users).id,
        message: lorem.generateWords(iRandomRange(1, 20)),
        created_at: new Date(),
      })
    }

    app.db.schemas.Message.insertMany(fakeMessages)
  }
}
