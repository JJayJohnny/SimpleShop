const express = require('express')
const router = express.Router()
const User = require('./../models/user').User
const Address = require('./../models/user').Address
const Order = require('./../models/order')
const bcrypt = require('bcrypt')
const {body, validationResult, checkSchema, check} = require('express-validator')
const validation = require('./../validators/user')

//logged user page
router.get('/', async (req, res) => {    
    if(req.session.loggedUser == null){
        res.redirect('/');
        return
    }
    var user = await User.findById(req.session.loggedUser).exec()
    let orders = await Order.find({userId: req.session.loggedUser}).exec()
    res.render('user/user', {user: user, orders: orders})
})

router.get('/login', (req, res) => {
    if(req.session.loggedUser != null){
        res.redirect('/user')
        return
    }
    res.render('user/login')
})
router.post('/login', checkSchema(validation.loginSchema), async (req, res) =>{
    let login = req.body.login
    let user = await User.findOne({'login': login}).exec()
    let passwordOK = false
    try{
        passwordOK = await bcrypt.compare(req.body.password, user.password)
    }
    catch{
        return res.render('user/login', {errorMessage: "Wrong login or password"})
    }
    if(passwordOK){
        req.session.loggedUser = user._id
        req.session.loggedUserLogin = user.login
        res.redirect('/')
    }
    else{
        res.render('user/login', {errorMessage: "Wrong login or password"})
    }
})

router.get('/register', (req, res) => {
    if(req.session.loggedUser != null)
        return res.redirect('/user')
    res.render('user/register', {user: new User({address: new Address()})})
})
router.post('/register', checkSchema(validation.registerSchema), async (req, res) => {
    let user = new User({
        login: req.body.login,
        name: req.body.name,
        email: req.body.email,
        address: new Address({
            street: req.body.street,
            houseNumber: req.body.houseNumber,
            city: req.body.city,
            postalCode: req.body.postalCode,
            country: req.body.country
        })
    })
    if(!validationResult(req).isEmpty())
        return res.render('user/register', {user: user, errorMessage: validationResult(req).array()[0]['msg']+": "+validationResult(req).array()[0]['param']})

    let sameLogin = await User.findOne({'login': user.login}).exec()
    if(sameLogin != null)
        return res.render('user/register', {user: user, errorMessage: "User with this login already exists"})

    let sameEmail = await User.findOne({'email': user.email}).exec()
    if(sameEmail != null)
        return res.render('user/register', {user: user, errorMessage: "User with this email already exists"})

    if(req.body.password != req.body.passwordRepeat)
        return res.render('user/register', {user: user, errorMessage: "Passwords are not the same"})

    let hash = await bcrypt.hash(req.body.password, 10)
    user.password=hash
    
    try{
        const newUser = await user.save()
        res.redirect('/user/login')
    }
    catch(error){
        console.log(error)
        res.render('user/register', {
            user: user,
            errorMessage: error
        })
    }
    
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

router.get('/edit', async (req, res) => {
    if(req.session.loggedUser == null)
        return res.redirect('/')

    var user = await User.findById(req.session.loggedUser).exec()
    res.render('user/edit', {user: user})
})
router.post('/edit', checkSchema(validation.editSchema), async (req, res) => {
    var user = await User.findById(req.session.loggedUser).exec()
    if(!validationResult(req).isEmpty()){
        res.render('user/edit', {user: user, errorMessage: validationResult(req).array()[0]['msg']+": "+validationResult(req).array()[0]['param']})
        console.log(validationResult(req).array())
        return
    }
    if(user.email != req.body.email){
        let sameEmail = await User.findOne({'email': req.body.email}).exec()
        if(sameEmail != null)
           return res.render('user/edit', {user: user, errorMessage: "User with this email already exists"})
    }
    let newAddress = Address({
        street: req.body.street,
        houseNumber: req.body.houseNumber,
        city: req.body.city,
        postalCode: req.body.postalCode,
        country: req.body.country
    })
    try{
        var updated = await User.findByIdAndUpdate(req.session.loggedUser, {
            email: req.body.email,
            name: req.body.name,
            address: newAddress
        })
        res.redirect('/user')
    }catch{
        res.redirect('/user/edit')
    }
})

router.get('/changePassword', (req, res) => {
    if(req.session.loggedUser == null)
       return res.redirect('/')
    res.render('user/changePassword')
})
router.post('/changePassword', checkSchema(validation.changePasswordSchema), async (req, res) => {
    if(req.body.password != req.body.passwordRepeat)
        return res.render('user/changePassword', {errorMessage: "Passwords are not the same"})

    let hash = await bcrypt.hash(req.body.password, 10)
    try{
        let changedUser = await User.findByIdAndUpdate(req.session.loggedUser, {password: hash})
        res.redirect('/user')
    }catch{
        res.render('user/changePassword', {errorMessage: "Error saving, please try again"})
    }
})

module.exports = router