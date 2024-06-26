const { Schema, model } = require('mongoose');


const productsCollection = 'usuarios'

const productsSchema = new Schema({
    title: {
        type: String,
        index: true // Esto es para indexar (para mejorar la velocidad de búsqueda en el array de usuarios)
    },
    category: String,
    price: Number,
    stock: Number
})

const productsModel = model(productsCollection, productsSchema);

module.exports = { productsModel };