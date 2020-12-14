const express = require ('express')
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const Properti = require('./models/properti')
const propertyRouter = require('./routes/property')
const methodOverride = require('method-override')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const path = require('path')
const crypto = require('crypto')

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


// static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))

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
// --------------------------------------------------------
// Upload image

// // Create mongo connection
// const conn = mongoose.createConnection(db);

// // Init gfs
// let gfs;

// conn.once('open', () => {
//   // Init stream
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection('uploads');
// });

// // Create storage engine
// const storage = new GridFsStorage({
//   url: db,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString('hex') + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads'
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });
// const upload = multer({ storage });

// // @route GET /
// // @desc Loads form
// app.get('/new', (req, res) => {
//   gfs.files.find().toArray((err, files) => {
//     // Check if files
//     if (!files || files.length === 0) {
//       res.render('property/_form_fields', { files: false });
//     } else {
//       files.map(file => {
//         if (
//           file.contentType === 'image/jpeg' ||
//           file.contentType === 'image/png'
//         ) {
//           file.isImage = true;
//         } else {
//           file.isImage = false;
//         }
//       });
//       res.render('property/_form_fields', { files: files });
//     }
//   });
// });

// // @route POST /upload
// // @desc  Uploads file to DB
// app.post('/upload', upload.single('file'), (req, res) => {
//   // res.json({ file: req.file });
//   res.redirect('/_form_fields');
// });

// // @route GET /files
// // @desc  Display all files in JSON
// app.get('/files', (req, res) => {
//   gfs.files.find().toArray((err, files) => {
//     // Check if files
//     if (!files || files.length === 0) {
//       return res.status(404).json({
//         err: 'No files exist'
//       });
//     }

//     // Files exist
//     return res.json(files);
//   });
// });

// // @route GET /files/:filename
// // @desc  Display single file object
// app.get('/files/:filename', (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     // Check if file
//     if (!file || file.length === 0) {
//       return res.status(404).json({
//         err: 'No file exists'
//       });
//     }
//     // File exists
//     return res.json(file);
//   });
// });

// // @route GET /image/:filename
// // @desc Display Image
// app.get('/image/:filename', (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     // Check if file
//     if (!file || file.length === 0) {
//       return res.status(404).json({
//         err: 'No file exists'
//       });
//     }

//     // Check if image
//     if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
//       // Read output to browser
//       const readstream = gfs.createReadStream(file.filename);
//       readstream.pipe(res);
//     } else {
//       res.status(404).json({
//         err: 'Not an image'
//       });
//     }
//   });
// });

// // @route DELETE /files/:id
// // @desc  Delete file
// app.delete('/files/:id', (req, res) => {
//   gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
//     if (err) {
//       return res.status(404).json({ err: err });
//     }

//     res.redirect('/_form_fields');
//   });
// });

// --------------------------------------------------------
// --------------------------------------------------------

//testing



// const fileFilter = (req, res, cb) => {
//     if(file.mimetype  === 'image/png' || 
//         file.mimetype  === 'image/jpg' ||
//         file.mimetype  === 'image/jpeg'){
//           cb(null, true)
//         }else{
//           cb(null, false)
//         }
// }

// app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))

// --------------------------------------------------------
// --------------------------------------------------------

// mongoose.connect('mongodb+srv://user1:142536@database.fyvsq.mongodb.net/database?retryWrites=true&w=majority',
//     { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

// app.set('view engine', 'ejs')

// app.use(express.urlencoded({ extended: false}))



// app.get('/admin', async (req, res) => {
//     const property = await Properti.find()
//     res.render('property/index', { property: property })
// })

app.use(methodOverride('_method'))
app.use('/property', propertyRouter)


// --------------------------------------------------------

const port = process.env.PORT || 3000;
app.listen(port, console.log(`sever started at port ${port}`));

// --------------------------------------------------------
// app.listen(3000)