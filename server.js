if(process.env.NODE_ENV != 'production'){
    require('dotenv').config()
}
const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const bodyParser = require('body-parser')
const session = require('express-session')

const indexRouter = require('./routes/index')
const productsRouter = require('./routes/products')
const cartRouter = require('./routes/cart')
const userRouter = require('./routes/user')

app.set('view engine', 'ejs')
app.set('views', __dirname+'/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))
app.use(session({
    secret: 'siema',
    saveUninitialized: true,
    resave: false
}))

app.use(function(req, res, next) {
    res.locals.loggedUser = req.session.loggedUser;
    res.locals.loggedUserLogin = req.session.loggedUserLogin;
    next();
});

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('connected to mongo'))

app.use('/', indexRouter)
app.use('/products', productsRouter)
app.use('/cart', cartRouter)
app.use('/user', userRouter)


app.listen(process.env.PORT || 3000)