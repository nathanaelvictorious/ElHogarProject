const express = require('express')
var events = require('events')

const app = express()

const port = 3000

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname,'./home.html'));
})

app.listen(port, () => {
    console.log('Server listening on port ${port}');
})

console.log("Hello World");