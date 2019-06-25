import React from 'react'
import AutoResizableTextArea from './AutoResizableTextArea/AutoResizableTextArea'
import Button from '../../../../../components/inputs/Button/Button'
import SendIcon from '../../../../../components/display/Icons/SendIcon'

import './Inputs.css'

const Inputs = ({value, SetValue, SendMessage}) => (
  <div className="chat-inputs">
    <AutoResizableTextArea
      className="chat-text-input"
      fontSize={24}
      value={value}
      SetValue={SetValue}
      onSend={SendMessage}
    />
    <Button className="chat-send-button" primary svgIcon={<SendIcon color="white" />} disabled={value.length === 0} onClick={SendMessage} />
  </div>
)

export default Inputs
