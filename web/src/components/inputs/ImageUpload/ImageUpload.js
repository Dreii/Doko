import React, {Component} from 'react'

//Load styles for image inputs
import './ImageUpload.css'

//Loading spinner for use while an image is uploading or downloading.
import ReactLoading from 'react-loading'

//a set of image tools that can be used for resizing an image with lots of cross browser support.
import ImageTools from "../../../functions/ImageTools"

//SVG Camera icon
import CameraIcon from '../../display/Icons/CameraIcon'

//Access the API to upload images.
import API from '../../../functions/api'

class ImageUpload extends Component {

  state = {
    uploading: false, //wether or not this component is currently uploading (shows loading spinner and stops new uploads)
    image: null, //the image thats been uploaded or null
  }

  //Main function of the component, processing, resizing and uploading images.
  UploadImage = (e) => {
    //when a new image is selected, we first reset any image already in the component and then start
    //uploading again.
    this.setState({ image: null, uploading: true })

    //extract the image file from the event.
    //then check the image for problems, and resize it.
    const file = e.target.files[0]
    ImageTools.process(file, {width: 158, height: 158})
    .then((processedFile) => {
      //Once resized, we attach the image to a form.
      const formData = new FormData()
      formData.append('file', processedFile)
      return formData
    })
    //the form is then sent to the API with an auth key
    .then(formData => API.UploadImage(this.props.auth, formData))
    //once the API takes our image, attaches it to our profile and saves it in a bucket we
    //load the image from the CDN and attach it to this component once loaded.
    .then((data)=>{
      this.SetImage(data.url)
      .then(() => this.props.onSuccess(data))
    })
    //if there are any errors we reset the component to default and
    //pass them up to the parent components to trigger an error component.
    .catch((err)=>{
      this.setState({image: null, uploading: false})
      this.props.onError(err.toString())
    })
  }

  componentDidMount(){
    if(this.props && this.props.image){
      this.SetImage(this.props.image)
    }
  }

  //if there is an image already in the user profile when this component loads,
  //we want to load it by default.
  componentDidUpdate(prevProps){
    if(this.props.image && this.props.image !== prevProps.image){
      this.SetImage(this.props.image)
    }
  }

  SetImage = (src) => {
    return new Promise((resolve, reject) => {
      this.setState({uploading: true})

      let img = new Image()
      img.src = src
      img.onload = () => {
        this.setState({image: this.props.image, uploading: false})
        resolve(img)
      }

      img.onError = (err) => reject(err)
    })
  }

  render() {
    let {uploading, image} = this.state
    return (
      <div id={this.props.id} className="image-upload">
        <div className="image-upload-image" style={{backgroundImage: image !== null ? `url('${image}')` : 'none'}}>
          {uploading ? (
            <ReactLoading type="spin" color="#0984E3" />
          ):(
            // button either has an image and is minimized or has no image and covers the whole component.
            <div className={`image-upload-button ${!image && "no-image"}`}>
              <label htmlFor="image-upload-input">
                <CameraIcon color="#707070" />
              </label>
              {/* file input is hidden so we can just use the label as a button */}
              <input type='file' id='image-upload-input' onChange={(e)=>this.UploadImage(e)} />
            </div>
          )}
        </div>
      </div>
    )
  }

}

export default ImageUpload
