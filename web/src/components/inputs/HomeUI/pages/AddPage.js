import React from 'react'
import './Pages.css'

import LocationIcon from '../../../display/Icons/LocationIcon'
import TextInput from '../../TextInput/TextInput'
import Button from '../../Button/Button'

const AddPage = ({title, onTitleChange, onSubmit, loading, success}) => (
  <div className="add-page home-ui-page">
    <h1 className="home-ui-title">Create Room</h1>

    <label className="home-ui-label" htmlFor="add-page-title">Title</label>
    <TextInput id="add-page-title" className="home-ui-input" value={title} onChange={onTitleChange} placeholder="eg: Great food Here!" />

    <Button
      primary
      svgIcon={<LocationIcon color="white" />}
      value="Place Room"
      loading={loading}
      success={success}
      onClick={onSubmit}
    />
  </div>
)

export default AddPage
