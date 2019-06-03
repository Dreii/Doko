import React from 'react'
import SearchButton from './SearchButton/SearchButton'
import Button from '../../components/Button/Button'
import Error from '../../components/Error/Error'

import './HomeUI.css'

const HomeUI = ({
  user, menuOpen, toggleMenuOpen, openRoom, searchOpen,
  toggleSearchOpen, searchString, setSearchString,
  chatData, SetAuth, error, errorLevel, uiReady
}) => (
  <div className="home-ui">
    <Error error={error} level={errorLevel} />

    <SearchButton
      id="search-button"
      placeholder="Search rooms..."
      className={`${openRoom !== null ? "hide":""}`}
      style={{left: !uiReady || openRoom !== null ? -64:16, marginTop: error !== "" ? 48:0}}
      open={searchOpen}
      toggleSearchOpen={toggleSearchOpen}
      value={searchString}
      onChange={setSearchString}
    />

    <Button
      icon="/add-icon.svg"
      iconAlt="add button icon"
      alt="add button"
      id="add-room-button"
      className={`${!uiReady || openRoom !== null ? "hide":""} ${menuOpen ? "open":""}`}
      primary
      style={{marginTop: error !== "" ? 48:0}}
    />

    <Button
      icon="/logout-icon.svg"
      iconAlt="logout buttton icon"
      alt="logout button"
      id="logout-button"
      className={`${!uiReady || openRoom !== null ? "hide":""} ${menuOpen ? "open":""}`}
      onClick={()=>SetAuth(null)}
      style={{marginTop: error !== "" ? 48:0}}
    />

    <Button
      icon={user.image}
      id="profile-button"
      className={`${!uiReady || openRoom !== null ? "hide":""}`}
      profile
      primary
      onClick={toggleMenuOpen}
      style={{marginTop: error !== "" ? 48:0}}
    />
  </div>
)

export default HomeUI
