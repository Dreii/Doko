module.exports = (app) => {
  console.log("setup hello")
  app.get("/", (req, res) => {
    console.log("got request")
    res.json({message:"Welcome to the Doko API."})
  })
}
