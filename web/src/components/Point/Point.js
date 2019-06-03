import React, { Component } from 'react'
import './Point.css'

class Point extends Component {

  componentDidMount(){

  }

  render() {
    let {x, y, color, onClick, chatNumber, selected, hide} = this.props
    return (
      <div className={`point ${color} ${selected ? "selected":""} ${hide?"hide":""}`} style={{left: x, top: y}} onClick={onClick}>
        <div className="point-background"></div>
        <span className="chat-number">{chatNumber < 100 ? chatNumber : `100+`}</span>
      </div>
    )
  }

}

export default Point
