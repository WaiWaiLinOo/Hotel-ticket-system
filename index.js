const express = require("express");
const app = express();
const cors = require("cors");
const cookieSession = require("cookie-session");
app.use(cors());
app.use(express.json()); // to get json in body request
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "bezkoder-session",
    // keys: ["COOKIE_SECRET"], // should use as secret environment variable
    secret: "COOKIE_SECRET",
    httpOnly: true,
  })
);
const router = require('./src/route')
console.log("router==",router)
const db = require('./src/config/db_config');
const env = process.env.NODE_ENV
require('dotenv').config({ path: `.env.${env}` })
const port = process.env.PORT
app.use('/v1', router)
app.get('*', (req, res) => {
  res.json({ msg: "Rout not found " })
})
db.sequelize.sync();
app.listen(port, () => {
  console.log(`App is listening and env file is ${env} and run at http://%s`,port);
}
);
