const express = require('express')
const router = express.Router()
const Product = require('./../models/product')
const multer = require('multer')
const uploadPath = Product.productImageBasePath
const imageMimeTypes = ['images/jpeg', 'images/png']
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadPath);
    },
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({storage: storage})

//add new product
router.get('/add', (req, res) => {
    res.render('products/add', {product: new Product()})
})

//post for new product
router.post('/', upload.array('photos'), async (req, res) => {
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        imageNames: []
    })
    req.files.forEach(file => {
        product.imageNames.push(file.filename)
    });
    try{
        const newProduct = await product.save()
        //res.redirect(`/products/${newProduct.id}`)
        res.redirect('/')
    }
    catch(error){
        res.render('products/add', {
            product: product,
            errorMessage: error
        })
    }
})

router.get('/addToCart', (req, res) => {
    id=req.query.id
    if(req.session.cart == null)
        req.session.cart = new Object()
    if(parseInt(req.query.numberOfItems) > parseInt(req.query.maxNumberOfItems)){
        res.redirect(`/products/${id}`, {errorMessage: "Too many items selected"})
    }
    req.session.cart[id]=parseInt(req.query.numberOfItems)
    res.redirect(`/products/${id}`)
})

router.get('/:id', async (req, res) => {
    try{
        let product = await Product.findById(req.params.id)
        res.render('products/view', {product: product})
    }
    catch{
        res.send("Product does not exist")
    }
})

module.exports = router