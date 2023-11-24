const express = require('express')
const app = express()
const dummyData = require('./data.json')
app.get('/',(req,res) =>{
    res.send('hello welcome')
})
app.get('/get',(req,res) =>{
    res.send(dummyData)
})
app.post('/post',(req,res) =>{
    res.send("This is post method")
})
app.delete('/delete',(req,res) =>{
    res.send("This is delete method")
})
app.listen(4000,console.log('Hello port welcome naw'))