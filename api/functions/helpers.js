const CalcDistance = require('./CalcDistance')

module.exports = {
  iRandom,
  iRandomRange,
  RandomRange,
  randomInArray,
  GenerateRandomProfile,
  GenerateRandomColor,
  CalcDistance
}

function iRandom(max){
  return Math.round(Math.random()*max)
}

function iRandomRange(min, max){
  return Math.round(Math.random()*(max-min))+min
}

function RandomRange(min, max){
  return (Math.random()*(max-min))+min
}

function randomInArray(array){
  return array[Math.ceil(Math.random()*array.length-1)]
}

function GenerateRandomProfile(id){
  if(id === undefined) id = 1000+iRandom(3000000)
  let image = `/test-person-images/${randomInArray(['person-1.png', 'person-2.png', 'person-3.png', 'person-4.png', 'person-5.png', 'person-6.png', 'person-7.png', 'person-8.png', 'person-9.png'])}`
  let firstName = randomInArray(['Skye', 'Matt', 'Mat', 'Brooke Lynne', 'Logan ', 'Thomas', 'Ian', 'Hunter', 'Adrienne', 'Nathan', 'Sean', 'Stephen', 'Lexa', 'Colten'])
  let lastName = randomInArray(['Aoki', 'Jenkins', 'Inglis', 'Kumar', 'Alcuran', 'Alcott', 'Baldwin', 'Ross', 'Thompson', 'Wilson', 'Char', 'Verhaagen', 'Colbert', 'Mink-Flacco', 'Moore'])

  let email = `email${id}@test.com`
  let password = "testpassword"

  return {id, email, password, image, firstName, lastName}
}

function GenerateRandomColor(originalIndex, excludedColor){
  let colors = ['red', 'green', 'pink', 'yellow']
  colors = colors.filter(color => color!==excludedColor)

  if(originalIndex!==undefined){
    let sequencedIndex = originalIndex > colors.length-1 ? (originalIndex % colors.length) : originalIndex
    return colors[sequencedIndex]
  }
  return randomInArray(colors)
}



// if bigger than 4 subtract by
