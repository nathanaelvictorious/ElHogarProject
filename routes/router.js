const express = require('express')
const Property = require('../models/property')
const router = express.Router()

console.log('router connected');

router.get('/:id', async (req, res) => {
    const properties = await Property.findById(req.params.id)
    if (properties== null) res.redirect('/home')
    res.render('property-single.ejs', { properties: properties})
})

module.exports = router

/*router.get('/property-single', async (req, res) => {
    const property = new Property({
        name: req.body.name,
        price: req.body.price,
        lokasi: req.body.lokasi,
        tipe: req.body.tipe,
        kt: req.body.kt,
        km: req.body.km,
        carslot: req.body.carslot,
        picture: req.body.picture,
        desc: req.body.desc,
    }) 
    res.render('properties/property-single.ejs', { property: property })
})

router.get('/', (req, res) => {
    const property = new Property({
        name: req.body.name,
        price: req.body.price,
        lokasi: req.body.lokasi,
        tipe: req.body.tipe,
        kt: req.body.kt,
        km: req.body.km,
        carslot: req.body.carslot,
        picture: req.body.picture,
        desc: req.body.desc,
    })

})


//res.redirect(`/property/${property.id}`)



router.get('/:id', async (req, res) => {
    const property = await Property.findById(req.params.id)
    if (property == null) res.redirect('/')
    res.render('property/details', { property: property})
})*/