const router = require('express').Router()
const {testController} = require('../controller/test.controller')
let data = [
    { id: 1, name: "Hotel1" },
    { id: 2, name: "Hotel2" },
    { id: 3, name: "Hotel3" },
    { id: 4, name: "Hotel4" },
    { id: 5, name: "Hotel5" },
  ];
router.get("/", (req, res) => {
    res.json(data);
});
router.get('/route',testController)
router.get("/get/:id", (req, res) => {
    const id = req.params.id;
    const result = data.filter((a) => a.id == id);
    res.json(result);
});
router.post("/post", (req, res) => {
    let id = data[data.length - 1].id + 1;
    data.push({
        id: id,
        name: req.body.name,
    });
    res.json(data);
});
router.post("/update/:id", (req, res) => {
    for (let c of data) {
        if (c.id == req.params.id) {
            c.name = req.body.name;
        }
    }
    res.json(data);
});
router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    const result = data.filter((a) => a.id != id);
    data = [...result];
    res.json(data);
});
module.exports = router