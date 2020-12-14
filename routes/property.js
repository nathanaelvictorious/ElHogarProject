const express = require('express')
const Properti = require('../models/properti')
const router = express.Router()

const {ensureAuthenticated} = require("../config/auth");

// router.use(ensureAuthenticated)
// ensureAuthenticated, 
router.get('/new', (req,res) => {
    res.render('property/new', { name: req.user.name, properti: new Properti()})
})

router.get('/edit/:id', async (req,res) => {
    
    const properti = await Properti.findById(req.params.id)
    res.render('property/edit', { name: req.user.name, properti: properti})
})

router.get('/:slug', async (req, res) => {
    
    const properti = await Properti.findOne( {slug: req.params.slug })
    if (properti == null) res.redirect('/')
    res.render('property/show', { name: req.user.name, properti: properti})
})

router.post('/', async (req, res, next) => {
    req.properti = new Properti()
    next()
  }, savePropertiAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
    req.properti = await Properti.findById(req.params.id)
    next()
  }, savePropertiAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
    await Properti.findByIdAndDelete(req.params.id)
    res.redirect('/admin')
})


function savePropertiAndRedirect(path) {
    return async (req, res) => {
      let properti = req.properti
      properti.nama = req.body.nama
      properti.harga = req.body.harga
      properti.jenis = req.body.jenis
      properti.lokasi = req.body.lokasi
      properti.alamat = req.body.alamat
      properti.tipe = req.body.tipe
      properti.luas = req.body.luas
      properti.kt = req.body.kt
      properti.km = req.body.km
      properti.cs = req.body.cs
      properti.deskripsi = req.body.deskripsi
      try {        
        properti = await properti.save()
        console.log('Already')
        res.redirect(`/property/${properti.slug}`)
      } catch (e) {
        res.render(`property/${path}`, { properti: properti })
      }
    }
  }

module.exports = router;