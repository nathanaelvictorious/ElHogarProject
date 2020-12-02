const express = require('express');
const path = require('path');
//const propertyRouter = require('./routes/router.js');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

const Property = require('./models/property.js');
const propertiesAll = Property.find()

app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs');
app.set('views', (__dirname, './views'));


app.get('/home', async (req, res) => {
    res.render('home.ejs')
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

app.get('/:id', async (req, res) => {
    console.log('Hello kontl');
    const properties = await Property.findById(req.params.id);
    if (properties== null) res.redirect('/home');

    res.render('property-single.ejs', { properties: properties});
})

/*app.post('/search', (req, res) => {
    let propertyQuery = new RegExp("^" + req.body.query)
    Property.find({name: {$regex: propertyQuery}})

    .then(property => {
        res.json(property)
    })

    .catch(err => {
        console.log(err)
    })
}) */

//app.use('/property', propertyRouter);



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})