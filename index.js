const express = require("express");
const app = express();
app.use(express.json());
// let {data} = require('./dummy')
let data = [
  { id: 1, name: "Hotel1" },
  { id: 2, name: "Hotel2" },
  { id: 3, name: "Hotel3" },
  { id: 4, name: "Hotel4" },
  { id: 5, name: "Hotel5" },
];
app.get("/", (req, res) => {
  res.json(data);
});
app.get("/get/:id", (req, res) => {
  const id = req.params.id;
  const result = data.filter((a) => a.id == id);
  res.json(result);
});
app.post("/post", (req, res) => {
  let id = data[data.length - 1].id + 1;
  data.push({
    id: id,
    name: req.body.name,
  });
  res.json(data);
});
app.post("/update/:id", (req, res) => {
  for (let c of data) {
    if (c.id == req.params.id) {
      c.name = req.body.name;
    }
  }
  res.json(data);
});
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  const result = data.filter((a) => a.id != id);
  data = [...result];
  res.json(data);
});
app.listen(4000, console.log("Hello port welcome naw"));
