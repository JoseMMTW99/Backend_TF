const express = require ('express');
const { Router } = require('express');
const { UserManagerMongo } = require('../dao/userManagerMongo');
const auth = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', (req, res) => {
    res.render('home', {
        title: 'Mercadito || José',
        username: user.username,
        nombre: user.nombre,
        apellido: user. apellido,
        role: user.role === 'admin', // Pongo esto asi para que de True or False, porque en home.handlebars necesito como condicion un booleano, no se puede con un string como 'admin' hacer el {{#if}} porque no funciona.
        products,
        styles: "home.css"
    });
});

// Chat incompleto del final de la clase 10
router.get('/chat', (req, res) => {
    res.render('chat', {styles: "chat.css"})
})

// Chat completo de la Clase 11
router.get('/chat2', (req, res) => {
    res.render('chat2', {styles: "chat2.css"})
})

// Paginación Clase 17
router.get('/users', auth, async (req, res) => {
    const userService = new UserManagerMongo()
    // ACA VEMOS COMO POMPAGINA MONgoOSE-PAGINATE
    // const resp = await userService.getUsers()
    // console.log(resp)
    // http://localhost:8080/users?numPage=1&limit=10 nos da como devolucion 10 usuarios gracias a que recibe el parametro "limits"
    const {numPage, limit} = req.query
    const { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage } = await userService.getUsers({limit, numPage})
    res.render('users', {
        styles: "users.css",
        users: docs,
        page,
        hasPrevPage, 
        hasNextPage,
        prevPage,
        nextPage
    })
})

const user = {
    username: 'josemmtw99',
    nombre: 'José',
    apellido: 'Martínez Terán',
    role: 'admin'
}
const products = [
    { id: 1, nombre: "Laptop HP Pavilion", precio: 800 },
    { id: 2, nombre: "Monitor ASUS 24 pulgadas", precio: 200 },
    { id: 3, nombre: "Teclado mecánico Logitech G Pro", precio: 100 },
    { id: 4, nombre: "Mouse inalámbrico Microsoft Surface", precio: 50 },
    { id: 5, nombre: "Disco duro externo Seagate 1TB", precio: 60 }
]

// Login Clase 19
router.get('/login', (req, res) => {
    res.render('login', {styles: "login.css"})
})

// Register Clase 19
router.get('/register', (req, res) => {
    res.render('register', {styles: "register.css"})
})


module.exports = router;