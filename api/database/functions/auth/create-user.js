module.exports = (self) => async function(data){

  let newUser = new self.schemas.User({
    ...data,
    // trunk: StartingTrunk(),
  })

  return newUser.save()
}
