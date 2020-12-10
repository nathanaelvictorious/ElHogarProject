const express = require('express');
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const path = require('path');
//const propertyRouter = require('./routes/router.js');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;
const passport = require('passport')
const cookieSession = require('cookie-session')
require('./config/passport-google20')

//passport config
require("./config/passport")(passport);
//db config
const db = require("./config/keys").MongoURI;


const Property = require('./models/property.js');
const propertiesAll = Property.find();

app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs');
// app.set('views', (__dirname, './views'));


app.get('/home', async (req, res) => {
    res.render('home.ejs')
})

// app.get('/aboutus', (req, res) => {
//     res.sendFile(`${__dirname}/public/aboutus.html`)
// })

app.get('/aboutus', async (req, res) => {
    res.render('aboutus.ejs')
})

app.get('/property', async (req, res) => {
    const properties = await Property.find()
    res.render('property-grid.ejs', {properties: properties})
});

app.get('/agents', (req, res) => {
    res.sendFile(`${__dirname}/public/agents-grid.html`)
})

app.get('/login', async (req, res) => {
    res.render('login.ejs')
})

app.get('/register', async (req, res) => {
    res.render('register.ejs')
})

app.get('/reset', (req, res) => {
    res.render('reset.ejs')
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


app.use(cookieSession({
    name: 'ElHogar-session',
    keys: ['key1', 'key2']
}))

app.use(passport.initialize());
app.use(passport.session());

// app.get('/failed', (req, res) => {
//     res.send('you failed to login')
// })

app.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/home');
  });





// passport Local
//connect mongodb

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("mongoDB Terkoneksi..."))
  .catch((err) => console.log(err));

// ejs
app.use(expressLayouts);
app.set("view engine", "ejs");

//bodyparser
app.use(express.urlencoded({ extended: false }));

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

app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));




app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})