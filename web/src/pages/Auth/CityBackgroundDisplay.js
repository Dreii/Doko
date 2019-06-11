import React from 'react'
import {Tween} from '../../functions/helpers'

const CityBackgroundDisplay = ({parallaxX}) => {
  return (
    <div className="city-background-display">
      <div className="sun"></div>
      {/*
        Tweens city backgrounds along the X axis ensuring that they dont go beyond their bounds.
        Tweens at different speeds to get a parallax effect.
       */}
      <img src="/city-2.svg" className="city city-2" style={{transform: `translateX(-${Tween(0, 960, parallaxX, 0.1)}px)`}} />
      <img src="/city-1.svg" className="city city-1" style={{transform: `translateX(-${Tween(0, 960, parallaxX, 0.25)}px)`}} />
      <img src="/city-0.svg" className="city city-0" style={{transform: `translateX(-${Tween(0, 960, parallaxX, 0.5)}px)`}} />
    </div>
  )
}

export default CityBackgroundDisplay
