const { Router } = require('express')
const { uploader } = require('../multer');

const viewsRouter = require('./views.router');
const usersRouter = require('./api/users.router');
const productsRouter = require('./api/products.router');
const cartsRouter = require('./api/carts.router');
const cookiesRouter = require('./api/cookies.router');
const sessionsRouter = require('./api/sessions.router');
const pruebasRouter = require('./api/pruebas.router');

const router = Router();

//ENDPOINTS

// http:localhost:8080/
router.use('/', viewsRouter)
// http:localhost:8080/api/users
router.use('/api/users', usersRouter)
// http:localhost:8080/api/users
router.use('/api/products', productsRouter)
// http:localhost:8080/api/carts
router.use('/api/carts', cartsRouter)
// http:localhost:8080/api/cookies
router.use('/cookies', cookiesRouter)
// http:localhost:8080/api/session
router.use('/api/sessions', sessionsRouter)
// http:localhost:8080/pruebas
router.use('/pruebas', pruebasRouter)


// Middleware para capturar errores
router.use((error, req, res, next) => {
    console.log(error);
    res.status(500).send('Error 500 en el servidor')
})

// MIDDLEWARE PARA SUBIR ARCHIVOS (configurado en el archivo "index.html")
router.use('/subir-archivo', uploader.single('myFile'), (req, res) => {
    if (!req.file) {
        return res.send('No se pudo subir el archivo')
    }
    res.send('Archivo subido')
})

module.exports = router;