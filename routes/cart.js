const express = require('express')
const router = express.Router()
const Product = require('./../models/product')

router.get('/', async (req, res) => {
    try{
    let items = await Product.find().where('_id').in(req.session.cart).exec()
    res.render('cart', {items: items})
    }
    catch{
        res.render('cart', {items: null})
    }
})

router.get('/remove', (req, res) => {
    let id = req.query.id
    let index = req.session.cart.findIndex(function(x){return x==id})
    req.session.cart.splice(index, 1)
    res.redirect('/cart')
})

module.exports = router