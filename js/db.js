const mongoose = require('mongoose')

const url = 'mongodb+srv://user1:142536@database.fyvsq.mongodb.net/database?retryWrites=true&w=majority'

const connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}

mongoose.connect(url, connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

const propertySchema = new mongoose.Schema ({
    name: String,
    price: Number,
    lokasi: String,
    tipe: String,
    kt: Number,
    km: Number,
    carslot: Number,
    picture: String,
    desc: String,
})

const Property = mongoose.model('Property', propertySchema);

Property.find({}).then(result => {
    result.forEach(property => {
        console.log(property)
    })
    mongoose.connection.close()
})