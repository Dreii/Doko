import React from 'react'
import './TextInput.css'

const TextInput = ({value, placeholder, onChange, color}) => (
  <input
    className="TextInput"
    placeholder={placeholder}
    onChange={onChange}
    value={value}
  />
)

export default TextInput
