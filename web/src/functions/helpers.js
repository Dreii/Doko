export function iRandom(max){
  return Math.round(Math.random()*max)
}

export function iRandomRange(min, max){
  return Math.round(Math.random()*max)+min
}

export function randomInArray(array){
  return array[Math.ceil(Math.random()*array.length-1)]
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


export function CalcDistance(lat1, lon1, lat2, lon2) {
	// let R = 6371
  let p = 0.017453292519943295    // Math.PI / 180
  let c = Math.cos
  let a = 0.5 - c((lat2 - lat1) * p)/2 +
          c(lat1 * p) * c(lat2 * p) *
          (1 - c((lon2 - lon1) * p))/2

  let km = 12742 * Math.asin(Math.sqrt(a)) // 2 * R; R = 6371 km
	return km/1.609
}

/**
 * Returns a percentage value between a min and max value, adjusted by a speed percentage.
 * @param       {[Number]} min   [lowest value that can go.]
 * @param       {[Number]} max   [highest value can go.]
 * @param       {[Number]} val   [value to interpolate]
 * @param       {[Number]} speed [speed modifer 0 - 1]
 * @constructor
 */
export function Tween(min, max, val, speed){
  return val/(max-min)*(max*speed)
}
