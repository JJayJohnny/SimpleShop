const mongoose = require('mongoose')

const productImageBasePath = 'public/uploads/productImages'

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price:{
        type: mongoose.Types.Decimal128,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    imageNames:[
        {
            type: String
        }
    ]    
})

module.exports = mongoose.model('Product', productSchema)
module.exports.productImageBasePath = productImageBasePath