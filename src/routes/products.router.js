const express = require('express');
const { Router } = require('express');

const router = Router();

let products = [];

// ENDPOINTS PRODUCTS CRUD

// Llamo a los productos
router.get('/', (req, res) => {
    res.send(products);
});

// Llamo a un producto
router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const productFound = products.find(product => product.id === parseInt(pid));

    res.send({ status: 'success', payload: productFound });
});

// Creo un producto
router.post('/', (req, res) => {
    const { name, price, description } = req.body;

    if (!name || !price) return res.send({ status: 'error', error: 'Faltan campos' });

    const newProduct = {
        id: products.length + 1,
        name,
        price,
        description
    };

    products.push(newProduct);
    res.status(200).send({ status: 'success', payload: products });
});

// Actualizo/cambio los datos de un producto
router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const productToUpdate = req.body;

    const productIndex = products.findIndex(product => product.id === parseInt(pid));
    if (productIndex === -1) return res.status(404).send({ status: 'error', error: 'Producto no encontrado' });

    products[productIndex] = { id: parseInt(pid), ...productToUpdate };

    res.send({ status: 'success', payload: productToUpdate });
});

// Borro un producto (también falta lógica)
router.delete('/:pid', (req, res) => {
    const { pid } = req.params;

    const productResult = products.filter(product => product.id !== parseInt(pid));

    res.send({ status: 'success', payload: productResult });
});

// export default productsRouter;
module.exports = router;