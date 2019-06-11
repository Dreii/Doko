import React from 'react'
import './TextInput.css'

const TextInput = ({value, type, placeholder, onChange, color}) => (
  <input
    className="TextInput"
    placeholder={placeholder}
    type={type || ""}
    onChange={onChange}
    value={value}
  />
)

export default TextInput
