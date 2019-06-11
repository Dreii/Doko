import React, {Component} from 'react'

//Load styles for image inputs
import './ImageUpload.css'

//Loading spinner for use while an image is uploading or downloading.
import ReactLoading from 'react-loading'

//a set of image tools that can be used for resizing an image with lots of cross browser support.
import ImageTools from "../../../functions/ImageTools"

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
      let img = new Image()
      img.src = data.url

      img.onload = () => {
        this.setState({image: data.url, uploading: false})
        this.props.onSuccess(data)
      }
    })
    //if there are any errors we reset the component to default and
    //pass them up to the parent components to trigger an error component.
    .catch((err)=>{
      this.setState({image: null, uploading: false})
      this.props.onError(err.toString())
    })
  }

  //if there is an image already in the user profile when this component loads,
  //we want to load it by default.
  componentDidUpdate(prevProps){
    if(this.props.image && this.props.image !== prevProps.image){

      this.setState({uploading: true})

      let img = new Image()
      img.src = this.props.image
      img.onload = () => {
        this.setState({image: this.props.image, uploading: false})
      }
    }
  }

  render() {
    let {uploading, image} = this.state
    return (
      <div className="image-upload">
        <div className="image-upload-image" style={{backgroundImage: image !== null ? `url('${image}')` : 'none'}}>
          {uploading ? (
            <ReactLoading type="spin" color="#0984E3" />
          ):(
            // button either has an image and is minimized or has no image and covers the whole component.
            <div className={`image-upload-button ${!image && "no-image"}`}>
              <label htmlFor="image-upload-input">
                {/* svg camera icon, using svg so we can animate fill color on hover. */}
                <svg xmlns="http://www.w3.org/2000/svg" width="36.41" height="32.769" viewBox="0 0 36.41 32.769">
                  <path id="camera-icon" d="M14.744,3A3.662,3.662,0,0,0,11.1,6.641V8.462H5.641A3.662,3.662,0,0,0,2,12.1V32.128a3.662,3.662,0,0,0,3.641,3.641H34.769a3.662,3.662,0,0,0,3.641-3.641V12.1a3.662,3.662,0,0,0-3.641-3.641H29.308V6.641A3.662,3.662,0,0,0,25.667,3Zm0,3.641H25.667V8.462A3.662,3.662,0,0,0,29.308,12.1h5.462V32.128H5.641V12.1H11.1a3.662,3.662,0,0,0,3.641-3.641Zm5.462,7.282a7.282,7.282,0,1,0,7.282,7.282A7.31,7.31,0,0,0,20.205,13.923Zm10.923,0a1.821,1.821,0,1,0,1.821,1.821A1.821,1.821,0,0,0,31.128,13.923ZM20.205,17.564a3.641,3.641,0,1,1-3.641,3.641A3.614,3.614,0,0,1,20.205,17.564Z" transform="translate(-2 -3)" fill="#707070"/>
                </svg>
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
