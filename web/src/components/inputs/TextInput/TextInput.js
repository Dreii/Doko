import React from 'react'
import './TextInput.css'

const TextInput = ({id, className, name, value, type, placeholder, onChange, color, onBlur, style}) => (
  <input
    id={id}
    className={`TextInput ${className}`}
    name={name}
    placeholder={placeholder}
    type={type || ""}
    onChange={onChange}
    value={value}
    onBlur={onBlur}
    style={style}
  />
)

export default TextInput
