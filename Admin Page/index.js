const express = require ('express')
const mongoose = require('mongoose')
const Properti = require('./models/properti')
const propertyRouter = require('./routes/property')
const methodOverride = require('method-override')

// --------------------------------------------------------
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
// --------------------------------------------------------

const app = express()

// --------------------------------------------------------

//passport config
require("./config/passport")(passport);

//db config

const db = require("./config/keys").MongoURI;

//connect mongodb

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
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

const { ensureAuthenticated } = require("./config/auth");

app.get("/admin", ensureAuthenticated, async (req, res) => {
  const property = await Properti.find()
  res.render("property/index", {
    name: req.user.name, property: property
  })
});

app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

// --------------------------------------------------------

// mongoose.connect('mongodb+srv://user1:142536@database.fyvsq.mongodb.net/database?retryWrites=true&w=majority',
//     { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

// app.set('view engine', 'ejs')

// app.use(express.urlencoded({ extended: false}))

app.use(methodOverride('_method'))

// app.get('/admin', async (req, res) => {
//     const property = await Properti.find()
//     res.render('property/index', { property: property })
// })

app.use('/property', propertyRouter)


// --------------------------------------------------------

const port = process.env.PORT || 3000;
app.listen(port, console.log(`sever started at port ${port}`));

// --------------------------------------------------------
// app.listen(3000)