const registerSchema = {
    login:{
        notEmpty: true,
        trim: true,
        escape: true
    },
    password:{
        notEmpty: true,
        trim: true,
        escape: true
    },
    passwordRepeat:{
        notEmpty: true,
        trim: true,
        escape: true
    },
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
    },

}

const loginSchema = {
    login:{
        notEmpty: true,
        trim: true,
        escape: true
    },
    password:{
        notEmpty: true,
        trim: true,
        escape: true
    }
}

const editSchema = {
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
    },

}

const changePasswordSchema = {
    password:{
        notEmpty: true,
        trim: true,
        escape: true
    },
    passwordRepeat:{
        notEmpty: true,
        trim: true,
        escape: true
    },
}

module.exports.loginSchema = loginSchema
module.exports.registerSchema = registerSchema
module.exports.changePasswordSchema = changePasswordSchema
module.exports.editSchema = editSchema