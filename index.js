const express = require('express');
const path = require('path');
//const propertyRouter = require('./routes/router.js');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

const Property = require('./models/property.js');

app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs');
app.set('views', (__dirname, './views'));


app.get('/', async (req, res) => {
    const location = await Property.find().distinct('lokasi')
    console.log(location)
    res.render('home.ejs', {location: location})
})

app.get('/aboutus', (req, res) => {
    res.sendFile(`${__dirname}/public/aboutus.html`)
})

app.get('/property', async (req, res) => {
    const location = await Property.find().distinct('lokasi')
    const properties = await Property.find()
    res.render('property-grid.ejs', {properties: properties})
});

app.get('/agents', (req, res) => {
    res.sendFile(`${__dirname}/public/agents-grid.html`)
})

//Get buat hasil search
app.get('/search', async (req, res) => {
    console.log('Search Success')
    
    try {
        const Keyword = req.query.keyword
        const Jenis = req.query.jenis
        const Lokasi = req.query.lokasi
        const Kt = req.query.kt
        const Km = req.query.km
        const Carslot = req.query.carslot
        const Price = req.query.price
        /*const Kt = parseInt(req.query.kt)
        const Km = parseInt(req.query.km)
        const Carslot = parseInt(req.query.carslot)
        const Price = parseInt(req.query.price)*/

        const properties = await Property.find({
            $or: [
                {$or: [{name: {$regex: Keyword, $options: 'i'}}, {desc: {$regex: Keyword, $options: 'i'}}]},
                {jenis: {$eq: Jenis},
                 lokasi: {$eq: Lokasi},
                 kt: {$eq: Kt},
                 km: {$eq: Km},
                 carslot: {$eq: Carslot},
                 price: {$gt: 0, $lte: Price}}
            ]
        }) 
        console.log(properties)
        res.render('property-grid.ejs', {properties: properties})
    } catch (err) {
    console.error(err);
    }
})

//Get property single buat id
app.get('/property/:id', async (req, res) => {
    console.log('Success');

    const properties = await Property.findById(req.params.id)
    if (properties== null) res.redirect('/home');

    res.render('property-single.ejs', { 
        properties: properties
    })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})