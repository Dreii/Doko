import React, { Component } from 'react'
import './SearchButton.css'

class SearchButton extends Component {

  render() {
    let {id, style, className, placeholder, onChange, value, open, toggleSearchOpen} = this.props
    return (
      <div
        id={id}
        className={`search-button ${className} ${open ? "open":""}`}
        style={style}
      >
        <input
          placeholder={placeholder}
          value={value}
          onChange={(e)=>onChange(e.target.value)}
          ref={(input) => {this.input = input}}
        />
        <button onClick={(()=>{
          if(!open)this.input.focus()
          toggleSearchOpen()
        })}></button>
      </div>
    )
  }

}

export default SearchButton
