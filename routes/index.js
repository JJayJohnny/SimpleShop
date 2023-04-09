const express = require('express')
const router = express.Router()
const Product = require('./../models/product')


router.get('/', async (req, res) => {
    try{
        let products = await Product.find({})
        res.render('index', {products: products})
    }
    catch{
        res.send('FATAL ERROR')
    }
})

module.exports = router