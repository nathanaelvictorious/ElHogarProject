const express = require('express');
var events = require('events');

const app = express();

const port = 3000;

app.use(express.static('public'));

app.get('/home', (req, res) => {
    res.sendFile('./home.html', {root: __dirname })
})

app.get('/aboutus', (req, res) => {
    res.sendFile('./aboutus.html', {root: __dirname })
})

app.get('/property', (req, res) => {
    res.sendFile('./property-grid.html', {root: __dirname})
})

app.get('/agents', (req, res) => {
    res.sendFile('./agents-grid.html', {root: __dirname})
})

app.get('/property', (req, res) => {
    res.sendFile('./property-grid.html', {root: __dirname})
})

app.listen(port, () => {
    console.log('Server listening on port ${port}');
})

console.log("Hello World");