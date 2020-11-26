const express = require('express');
const path = require('path');
//const propertyRouter = require('./routes/router');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

const Property = require('./models/property.js');

app.use(express.static(__dirname+ '/public'));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));


app.get('/home', (req, res) => {
    res.sendFile(`${__dirname}/public/home.html`)
})

app.get('/aboutus', (req, res) => {
    res.sendFile(`${__dirname}/public/aboutus.html`)
})

app.get('/property', async (req, res) => {
    const properties = await Property.find()
    res.render('views/properties/property-grid.ejs', {properties: properties})
});

app.get('/agents', (req, res) => {
    res.sendFile(`${__dirname}/public/agents-grid.html`)
})

//app.use('/property', propertyRouter);


/*app.get('/property/:id', (request, response) => {
    Property.findById(request.params.id).then(property => {
      response.json(property)
    })
  })*/

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})