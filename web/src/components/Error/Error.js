import React from 'react'

import './Error.css'

const Error = ({error, level, shake}) => (
  <div className={`Error ${error !== "" && "active" } level-${level} ${shake && "shake"}`}>
    <p>{error}</p>
  </div>
)

export default Error
