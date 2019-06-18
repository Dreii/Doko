import React from 'react'

import './Error.css'

const Error = ({error, level, show}) => (
  <div className={`Error ${show && "show" } level-${level}`}>
    <p>{error.length > 36 ? error.substr(0, 36)+'...' : error}</p>
  </div>
)

export default Error
