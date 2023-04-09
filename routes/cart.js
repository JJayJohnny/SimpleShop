const express = require('express')
const router = express.Router()
const Product = require('./../models/product')

router.get('/', async (req, res) => {
    try{
    let items = await Product.find().where('_id').in(Object.keys(req.session.cart)).exec()
    res.render('cart', {items: items, cart: req.session.cart})
    }
    catch(error){
        res.render('cart', {items: new Array, cart: new Object()})
    }
})

router.get('/remove', (req, res) => {
    let id = req.query.id
    //let index = req.session.cart.findIndex(function(x){return x==id})
    //req.session.cart.splice(index, 1)
    delete req.session.cart[id]
    res.redirect('/cart')
})

module.exports = router