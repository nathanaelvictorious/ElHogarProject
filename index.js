const express = require('express');
const path = require('path');
const propertyRouter = require('./routes/router.js');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

const Property = require('./models/property.js');

app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs');
app.set('views', (__dirname, './views'));


app.get('/home', (req, res) => {
    res.sendFile(`${__dirname}/public/home.html`)
})

app.get('/aboutus', (req, res) => {
    res.sendFile(`${__dirname}/public/aboutus.html`)
})

app.get('/property', async (req, res) => {
    const properties = await Property.find()
    res.render('property-grid.ejs', {properties: properties})
});

app.get('/agents', (req, res) => {
    res.sendFile(`${__dirname}/public/agents-grid.html`)
})

app.use('/property', propertyRouter);



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})