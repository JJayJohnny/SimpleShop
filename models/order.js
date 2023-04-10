const mongoose = require('mongoose')
const Address = require('./user').Address

const orderSchema = new mongoose.Schema({
    status:{
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: false
    },
    products:[
        {
            id:{
                type: String,
                required: true
            },
            quantity:{
                type: Number,
                required: true
            }
        }
    ],
    customerName:{
        type: String,
        required: true
    },
    address:{
        type: Address.schema,
        required: true
    }
},{timestamps: true})

module.exports = mongoose.model('Order', orderSchema)