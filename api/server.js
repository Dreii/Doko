require('dotenv').config()
const app = require('./functions/setup')
const https = require('https')
const fs = require('fs')

https.createServer({
  key: fs.readFileSync(process.env.NODE_SERVER_KEY),
  cert: fs.readFileSync(process.env.NODE_SERVER_CERT)
}, app)
.listen(app.get("port"), () => {
  console.log(`Find the server at: https://localhost:${app.get("port")}/`)
});
