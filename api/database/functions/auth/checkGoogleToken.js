let https = require('https')
const {OAuth2Client} = require('google-auth-library')
const client = new OAuth2Client(process.env.GAPPID)

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GAPPID,   // Specify the CLIENT_ID of the app that accesses the backend
                                      // Or, if multiple clients access the backend:
                                      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];

  return payload
}

module.exports = (token) => {
  let ret = verify(token).catch(console.error)
  return ret
}
