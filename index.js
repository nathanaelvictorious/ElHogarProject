const express = require('express');
const path = require('path');
// const propertyRouter = require('./routes/router.js');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000

const bodyParser = require("body-parser");
const Properti = require('./models/properti')
const propertyRouter = require('./routes/property')
const methodOverride = require('method-override')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const crypto = require('crypto')

const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const Property = require('./models/property.js');

app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs');
app.set('views', (__dirname, './views'));

//passport config
require("./config/passport")(passport);

//db config

const db = require("./config/keys").MongoURI;

//connect mongodb

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log("mongoDB Terkoneksi..."))
  .catch((err) => console.log(err));




app.get('/', async (req, res) => {
    const location = await Property.find().distinct('lokasi')
    console.log(location)
    res.render('home.ejs', {location: location})
})

app.get('/aboutus', (req, res) => {
    res.sendFile(`${__dirname}/public/aboutus.html`)
})

app.get('/property', async (req, res) => {
    const properties = await Properti.find()
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

// Get property single buat id
// ------------------------------------------
// Note : get yg ini bentrok
app.get('/properties/:id', async (req, res) => {
    console.log('Success');

 const properties = await Properti.findById(req.params.id)
    if (properties== null) res.redirect('/home');

     res.render('property-single.ejs', { 
         properties: properties
     })
 })



app.use('/css', express.static(__dirname + 'public/css'))

app.use(expressLayouts);


//bodyparser
app.use(express.urlencoded({ extended: false }));


// static files
app.use(express.static('public'))

// express session middleware

app.use(
  session({
    secret: "rahasia",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

// global var
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

const { ensureAuthenticated } = require("./config/auth");

app.get("/admin", ensureAuthenticated, async (req, res) => {
  const property = await Properti.find()
  res.render("property/index", {
    name: req.user.name, property: property
  })
});

app.use(methodOverride('_method'))
app.use('/property', propertyRouter)



app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})