import React from 'react'
import './Button.css'

const Button = ({noBack, primary, profile, icon, iconAlt, value, onClick, alt, style, className, id}) => (
  <button
    id={id}
    className={`button ${className} ${icon ? "icon":""} ${profile ? "profile":""} ${value ? "value":""} ${primary ? "primary":""} ${noBack ? "no-back":""}`}
    onClick={onClick}
    alt={alt||"button"}
    style={style}
  >
    {icon ? <img className="button-icon" src={icon} alt={iconAlt || "button icon"}/>:null}
    {value ? <span>{value}</span>:null}
  </button>
)

export default Button
