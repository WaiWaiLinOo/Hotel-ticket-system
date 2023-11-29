const express = require("express");
const app = express();
app.use(express.json()); // to get json in body request
const router = require('./src/route')
const db = require('./src/config/db_config');
const env = process.env.NODE_ENV
require('dotenv').config({ path: `.env.${env}` })
const port = process.env.PORT
app.use('/v1', router)
app.get('*', (req, res) => {
  res.json({ msg: "Rout not found" })
})
db.sequelize.sync();
app.listen(port, () => {
  console.log(`App is listening and env file is ${env} and run at http://%s`,port);
}
);
