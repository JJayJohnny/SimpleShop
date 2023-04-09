const express = require('express')
const router = express.Router()
const User = require('./../models/user').User
const Address = require('./../models/user').Address
const bcrypt = require('bcrypt')

//logged user page
router.get('/', async (req, res) => {    
    if(req.session.loggedUser == null)
        res.redirect('/');
    var user = await User.findById(req.session.loggedUser).exec()
    res.render('user/user', {user: user})
})

router.get('/login', (req, res) => {
    res.render('user/login')
})
router.post('/login', async (req, res) =>{
    let login = req.body.login
    let user = await User.findOne({'login': login}).exec()
    let passwordOK = false
    try{
        passwordOK = await bcrypt.compare(req.body.password, user.password)
    }
    catch{
        res.render('user/login', {errorMessage: "Wrong login or password"})
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
    res.render('user/register', {user: new User({address: new Address()})})
})
router.post('/register', async (req, res) => {
    let user = new User({
        login: req.body.login,
        email: req.body.email,
        address: new Address({
            street: req.body.street,
            houseNumber: req.body.houseNumber,
            city: req.body.city,
            postalCode: req.body.postalCode,
            country: req.body.country
        })
    })
    let sameLogin = await User.findOne({'login': user.login}).exec()
    if(sameLogin != null){
        res.render('user/register', {user: user, errorMessage: "User with this login already exists"})
        return
    }
    let sameEmail = await User.findOne({'email': user.email}).exec()
    if(sameEmail != null){
        res.render('user/register', {user: user, errorMessage: "User with this email already exists"})
        return
    }
    if(req.body.password != req.body.passwordRepeat){
        res.render('user/register', {user: user, errorMessage: "Passwords are not the same"})
        return
    }
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

module.exports = router