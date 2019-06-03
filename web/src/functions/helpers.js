export function iRandom(max){
  return Math.round(Math.random()*max)
}

export function iRandomRange(min, max){
  return Math.round(Math.random()*max)+min
}

export function randomInArray(array){
  return array[Math.ceil(Math.random()*array.length-1)]
}

export function GenerateRandomProfile(id){
  if(id === undefined) id = 1000+iRandom(3000000)
  let img = `/test-person-images/${randomInArray(['person-1.png', 'person-2.png', 'person-3.png', 'person-4.png', 'person-5.png', 'person-6.png', 'person-7.png', 'person-8.png', 'person-9.png'])}`
  let name = randomInArray(['Skye Aoki', 'Matt Jenkins', 'Brooke Lynne Alcuran', 'Logan Alcott', 'Thomas Baldwin', 'Ian Ross', 'Hunter S. Thompson', 'Adrienne Wilson', 'Nathan Char'])

  return {id, img, name}
}

export function RandomProfileTestImage(){
  return `/test-person-images/${randomInArray(['person-1.png', 'person-2.png', 'person-3.png', 'person-4.png', 'person-5.png', 'person-6.png', 'person-7.png', 'person-8.png', 'person-9.png'])}`
}

export function GenerateRandomColor(originalIndex, excludedColor){
  let colors = ['red', 'green', 'pink', 'yellow']
  colors = colors.filter(color => color!==excludedColor)

  if(originalIndex!==undefined){
    let sequencedIndex = originalIndex > colors.length-1 ? (originalIndex % colors.length) : originalIndex
    return colors[sequencedIndex]
  }
  return randomInArray(colors)
}


/**
 * Calculates the haversine distance between point A, and B.
 * @param {number[]} latlngA [lat, lng] point A
 * @param {number[]} latlngB [lat, lng] point B
 * @param {boolean} isMiles If we are using miles, else km.
 */
export function CalcDistance(latlngA, latlngB, isMiles){
  const toRad = x => (x * Math.PI) / 180;
  const R = 6371; // km

  const dLat = toRad(latlngB[0] - latlngA[0]);
  const dLatSin = Math.sin(dLat / 2);
  const dLon = toRad(latlngB[1] - latlngA[1]);
  const dLonSin = Math.sin(dLon / 2);

  const a = (dLatSin * dLatSin) +
            (Math.cos(toRad(latlngA[1])) * Math.cos(toRad(latlngB[1])) * dLonSin * dLonSin);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let distance = R * c;

  if (isMiles) distance /= 1.60934;

  return distance;
}
