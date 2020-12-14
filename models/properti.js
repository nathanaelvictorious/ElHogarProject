const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const propertiSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true
    },
    harga: {
        type: String,
        required: true
    },
    jenis: {
        type: String,
        required: true
    },
    lokasi: {
        type: String,
        required: true
    },
    alamat: {
        type: String,
        required: true
    },
    tipe: {
        type: String,
        required: true
    },
    luas: {
        type: String,
        required: true
    },
    kt: {
        type: String,
        required: true
    },
    km: {
        type: String,
        required: true
    },
    cs: {
        type: String,
        required: true
    },
    // deskripsi: {
    //     type: String
    // },
    deskripsi: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
})

propertiSchema.pre('validate', function(next) {
    if (this.nama) {
        this.slug = slugify(this.nama, { lower: true, 
        strict: true })
    }

    if (this.deskripsi) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.deskripsi))
    }

    next()
})

propertiSchema.virtual('coverImagePath').get(function (){
    if(this.img != null && this.imgType != null){
        return `data:${this.imgType};charset=utf-8;base64,${this.img.toString('base64')}`;
    }
})

module.exports = mongoose.model('Properti', propertiSchema)