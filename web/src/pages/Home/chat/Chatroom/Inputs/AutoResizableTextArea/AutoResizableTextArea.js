import React, { Component } from 'react'
import './AutoResizableTextArea.css'

class AutoResizableTextArea extends Component {

  state = {
    value: '',
    rows: 1,
    minRows: 1,
    maxRows: 5,
    shiftPressed: false
  }

  componentDidMount(){
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)

    window.addEventListener('keyup', this.handleKeyUp)
    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount(){
    window.removeEventListener('keyup', this.handleKeyUp)
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown(e){if(e.key === 'Shift') {
    this.setState({shiftPressed:true})}
  }
  handleKeyUp(e){
    if(this.props.value !== ""){
      if(e.key === 'Shift') this.setState({shiftPressed:false})
      if(e.key === 'Enter' && !this.state.shiftPressed && this.props.value.trim() !== ""){
        this.props.onSend()
        this.setState({rows: this.state.minRows})
      }
    }
  }

  handleChange = (event) => {
		const textareaLineHeight = this.props.fontSize
		const { minRows, maxRows } = this.state

		const previousRows = event.target.rows
  	event.target.rows = minRows // reset number of rows in textarea

		const currentRows = ~~(event.target.scrollHeight / textareaLineHeight)-1

    if (currentRows === previousRows) {
    	event.target.rows = currentRows
    }

		if (currentRows >= maxRows) {
			event.target.rows = maxRows
			event.target.scrollTop = event.target.scrollHeight
		}

    let val = event.target.value
    if(val !== " " && val !== "\n"){
      this.props.SetValue(val)
      this.setState({rows: currentRows < maxRows ? currentRows : maxRows})
    }
	}

  render() {
    let {rows} = this.state
    let {className, fontSize, value} = this.props
		return (
			<textarea
				rows={rows}
				value={value}
				placeholder={'Enter your text here...'}
				className={`resizeable-text-area ${className}`}
				onChange={this.handleChange}
        style={{fontSize, lineHeight: fontSize+'px'}}
			/>
		)
	}
}

export default AutoResizableTextArea
