const express = require('express')
const router = express.Router()
const Order = require('./../models/order')
const Product = require('./../models/product')
const Address = require('./../models/user').Address
const User = require('./../models/user').User
const {body, validationResult} = require('express-validator')

router.get('/', (req, res) => {
    res.redirect('/')
})

router.get('/make', async (req, res) => {
    try{
        let items = await Product.find().where('_id').in(Object.keys(req.session.cart)).exec()
        if(items.length == 0)
            throw "No items in cart"
        if(req.session.loggedUser != null){
            let user = await User.findById(req.session.loggedUser).exec()
            res.render('order/make', {cart: req.session.cart, items: items, customerName: user.name, address: user.address, email: user.email})
        }
        else{
            res.render('order/make', {cart: req.session.cart, items: items, customerName: "", address: new Address(), email: ""})
        }
    }catch{
        res.redirect('/')
    }   
})
router.post('/make', body(['name', 'street', 'houseNumber', 'city', 'country', 'postalCode']).escape(), body('email').isEmail().normalizeEmail(), async (req, res) => {
    let items = await Product.find().where('_id').in(Object.keys(req.session.cart)).exec()
    let order = new Order({
        status: "Ordered",
        customerName: req.body.name,
        email: req.body.email,
        address: new Address({
            street: req.body.street,
            houseNumber: req.body.houseNumber,
            city: req.body.city,
            postalCode: req.body.postalCode,
            country: req.body.country
        })
    })
    if(!validationResult(req).isEmpty()){
        res.render('order/make', {cart: req.session.cart, items: items, customerName: order.customerName, address: order.address, email: order.email, errorMessage: validationResult(req).array()[0]['msg']+": "+validationResult(req).array()[0]['param']})
        return
    }  
    items.forEach(item => {
        if(item.quantity < req.session.cart[item.id]){
            res.render('order/make', {cart: req.session.cart, items: items, customerName: order.customerName, address: order.address, email: order.email, errorMessage: "Chosen amount of at least one item excedes available quantity"})
            return
        }
        order.products.push(new Object({id: item.id, quantity: req.session.cart[item.id]}))
    });
    if(req.session.loggedUser != null)
        order.userId = req.session.loggedUser
    
    try{
        const newOrder = await order.save()
        delete req.session.cart
        res.redirect('/user')
    }catch(error){
        res.render('order/make', {cart: req.session.cart, items: items, customerName: order.customerName, address: order.address, email: order.email, errorMessage: error})
    }
})

router.get('/:id', (req, res)=>{
    res.send("Order info page")
})

module.exports = router