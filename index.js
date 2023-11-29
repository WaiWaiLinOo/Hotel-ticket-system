const express = require("express");
const app = express();
app.use(express.json()); // to get json in body request
const router = require('./src/route')
const env = process.env.NODE_ENV
require('dotenv').config({ path: `.env.${env}` })
const port = process.env.PORT
app.use('/v1', router)
app.get('*', (req, res) => {
  res.json({ msg: "Rout not found" })
})
app.listen(port, console.log(`Server is running,env file is ${env}, and port is ${port}`));
