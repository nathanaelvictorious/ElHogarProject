const mongoose = require('mongoose')

const url = 'mongodb+srv://user1:142536@database.fyvsq.mongodb.net/database?retryWrites=true&w=majority'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const propertySchema = new mongoose.Schema ({
    name: String,
    price: Number,
    jenis: String,
    lokasi: String,
    alamat: String,
    tipe: String,
    luas: Number,
    kt: Number,
    km: Number,
    carslot: Number,
    picture: String,
    desc: String,
})

propertySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Property', propertySchema)