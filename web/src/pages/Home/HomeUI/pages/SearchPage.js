import React from 'react'
import './Pages.css'

import SearchIcon from '../../../../components/display/Icons/SearchIcon'
import TextInput from '../../../../components/inputs/TextInput/TextInput'
import Button from '../../../../components/inputs/Button/Button'

const SearchPage = ({place, onPlaceChange, rooms, onRoomsChange, onSubmit, loading, success}) => (
  <div className="search-page home-ui-page">
    <h1 className="home-ui-title">Search</h1>

    <label className="home-ui-label" htmlFor="search-page-place">Find a Place.</label>
    <TextInput id="search-page-place" className="home-ui-input" value={place} onChange={onPlaceChange} placeholder="eg: Austin, Japan or 96813" />

    <label className="home-ui-label" htmlFor="search-page-rooms">Find a Room.</label>
    <TextInput id="search-page-rooms" className="home-ui-input" value={rooms} onChange={onRoomsChange} placeholder="eg: Food, Music, or Beers" />

    <Button
      primary
      svgIcon={<SearchIcon color="white" />}
      value="Begin Search"
      loading={loading}
      success={success}
      onClick={onSubmit}
    />
  </div>
)

export default SearchPage
