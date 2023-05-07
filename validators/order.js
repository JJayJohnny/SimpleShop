const orderSchema = {
    name: {
        notEmpty: true,
        trim: true,
        escape: true
    },
    street: {
        notEmpty: true,
        trim: true,
        escape: true
    },
    houseNumber: {
        notEmpty: true,
        trim: true,
        escape: true
    },
    city: {
        notEmpty: true,
        trim: true,
        escape: true
    },
    country: {
        notEmpty: true,
        trim: true,
        escape: true
    },
    postalCode: {
        notEmpty: true,
        trim: true,
        escape: true
    },
    email: {
        notEmpty: true,
        trim: true,
        escape: true,
        isEmail: true,
        normalizeEmail: true
    }

}

module.exports.orderSchema = orderSchema