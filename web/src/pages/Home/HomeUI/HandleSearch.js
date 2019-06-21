import API from '../../../functions/api'

export default function HandleSearch(){
  let {searchLocation, searchRooms, page} = this.state

  this.props.FilterRooms(this.state.searchRooms)

  if(searchLocation.length > 0){
    this.setState({formLoading: true, formTarget:'search', searchLocation:""})

    API.SendSecure(this.props.auth, 'search-location', {query: searchLocation})
    .then(res => {
      if(res.status === "OK"){
        this.SetSuccess()
        let location = res.results[0].geometry.location
        this.props.MoveMap({latitude: location.lat, longitude: location.lng})
        this.props.SetMenuOpen(false)
      }else{
        if(res.status === "NO_RESULTS")
          this.props.HandleError("no results", 0)
        else
          this.props.HandleError("error searching", 3)

        this.setState({formLoading: false})
      }
    })
  }else{
    if(page === "search" && searchRooms !== "")
      this.setState({showingDynamicRoomSearch: true})

    this.props.SetMenuOpen(false)
  }
}
