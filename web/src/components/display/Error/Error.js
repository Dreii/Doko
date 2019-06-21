import React from 'react'

import './Error.css'

const Error = ({error, level, show}) => (
  <div className={`Error ${show && "show" } level-${level}`}>
    <p>
      {
        typeof error === 'string' || error instanceof String ? (
          error.length > 36 ? error.substr(0, 36)+'...' : error
        ):(
          error === undefined ? 'Error' : error.toString().substr(0, 36)
        )
      }
    </p>
  </div>
)

export default Error
