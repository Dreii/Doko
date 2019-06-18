const fetch = require('node-fetch');

module.exports = (app) => {
  app.post("/search-location",
  require('../functions/CheckAuthToken')(app),
  (req, res) => {
    try{
      let endpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(req.body.query)}&key=AIzaSyAo192C7szGPfwsqdkCzrW_clm_bKbVy88`
      return fetch(endpoint)
      .then(response => response.json())
      .then(response => {
        res.status(200).json(response)
      })
    }catch(e){
      res.status(401).send({error: e.message})
    }
  })
}
