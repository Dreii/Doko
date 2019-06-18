module.exports = (app) => (req, res, next) => {
  let decoded, error

  //if no auth header supplied return error.
  if(!req.headers.auth) error = {error: "Not Authorized"}
  //verify auth header.
  else try{decoded = app.jwt.verify(req.headers.auth, process.env.JWT_SECRET)}
  catch(err){error = err}

  if(error) res.status(401).send({error: "Not Authorized"})
  else{
    res.locals.id = decoded._id
    next()
  }
}
