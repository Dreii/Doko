import React from 'react'
import './Button.css'

import CheckIcon from '../../display/Icons/CheckIcon'
import ReactLoading from 'react-loading'

const Button = ({
  noBack, primary, profile, icon,
  svgIcon, iconAlt, value, onClick,
  alt, style, className, id, loading,
  success, disabled
}) => (
  <button
    id={id}
    className={`button ${className} ${icon ? "icon":""} ${profile ? "profile":""} ${value ? "value":""} ${primary ? "primary":""} ${noBack ? "no-back":""} ${success ? "success":""}`}
    onClick={onClick}
    alt={alt||"button"}
    disabled={loading || success || disabled}
    style={style}
  >
    {loading ? (<ReactLoading type="spin" color={primary ? "white":"#707070"} height={32} width={32} />):(success ? (<CheckIcon color="white"/>):(
      <div className="button-inner">
        {
          icon ? <div className="button-icon" alt={iconAlt || "button icon"} style={{backgroundImage: `url("${icon}")`}}></div> : null
        }
        {svgIcon}
        {value ? <span>{value}</span>:null}
      </div>
      )
    )}
  </button>
)

export default Button
