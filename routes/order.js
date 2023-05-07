const express = require('express')
const router = express.Router()
const Order = require('./../models/order')
const Product = require('./../models/product')
const Address = require('./../models/user').Address
const User = require('./../models/user').User
const {body, validationResult, checkSchema} = require('express-validator')
const validation = require('./../validators/order')

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
router.post('/make', checkSchema(validation.orderSchema), async (req, res) => {
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

router.get('/:id', async (req, res)=>{
    try{
        let order = await Order.findById(req.params.id).exec()
        let productIDs = []
        order.products.forEach(product => {
            productIDs.push(product.id)
        })
        let items = await Product.find().where('_id').in(productIDs)
        res.render('order/view', {order: order, items: items})
    }
    catch{
        res.send("Order with this id does not exist")
    }
})

module.exports = router