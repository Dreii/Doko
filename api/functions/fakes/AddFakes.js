const mongoose = require('mongoose')
const GenerateRandomColor = require('../helpers').GenerateRandomColor
const HashCode = require('../helpers').HashCode
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
      let _id = mongoose.Types.ObjectId(),
          color = GenerateRandomColor(HashCode(_id.toString())),
          image = mediaCDN+randomInArray(['person-1.png', 'person-2.png', 'person-3.png', 'person-4.png', 'person-5.png', 'person-6.png', 'person-7.png', 'person-8.png', 'person-9.png']),
          firstName = randomInArray(['Ashley', 'Skye', 'Matt', 'Mat', 'Brooke Lynne', 'Logan ', 'Thomas', 'Ian', 'Hunter', 'Adrienne', 'Nathan', 'Sean', 'Stephen']),
          lastName = randomInArray(['Aoki', 'Jenkins', 'Inglis', 'Kumar', 'Alcuran', 'Alcott', 'Baldwin', 'Ross', 'Thompson', 'Wilson', 'Char', 'Verhaagen', 'Colbert']),
          name = firstName + ' ' + lastName

          email = `email${i}@test.com`,
          password = "testpassword"

      fakeUsers.push({_id, color, email, password, image, name, created_at: new Date()})
    }

    await app.db.schemas.User.insertMany(fakeUsers)
  }

  if(roomCount < 1){
    let users = await app.db.schemas.User.find()
    let fakeRooms = []
    for(let i=0; i<iRandomRange(10, 15); i++){
      let user = randomInArray(users)._id
      fakeRooms.push({
        location: [
          RandomRange(-97.717556, -97.785877),
          RandomRange(30.21338, 30.314794)
        ],
        name: lorem.generateWords(iRandomRange(3, 5)),
        creator: user,
        color: user.color,
        created_at: new Date(),
      })
    }

    await app.db.schemas.Room.insertMany(fakeRooms)
  }


 if(messageCount < 1){
   let users = await app.db.schemas.User.find()
   let rooms = await app.db.schemas.Room.find().populate('creator')

   for(let k=0;k<iRandomRange(50, 100);k++){
     let room = randomInArray(rooms)
     let sender = randomInArray(users)._id

     //generate a random color for this message, excluding the room color.
     let color = GenerateRandomColor(HashCode(sender.toString()), room.creator.color)

    message = new app.db.schemas.Message({
       room: room._id,
       sender,
       color,
       message: lorem.generateWords(iRandomRange(1, 20)),
       created_at: new Date()
     })

     message = await message.save()

     await app.db.schemas.Room.findOneAndUpdate({_id: room}, {$push:{messages: {$each: [message._id], $position: 0}}, $addToSet:{members:sender}})
   }

 }
}
