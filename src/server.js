const express = require ('express');
const viewsRouter = require('./routes/views.router');
const usersRouter = require('./routes/users.router');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const cookiesRouter = require('./routes/cookies.router');
const sessionsRouter = require('./routes/sessions.router');
const { uploader } = require('./multer');
// Motor de plantilla
const handlebars = require('express-handlebars');
// Servidor de Socket
const socketIO = require('socket.io')
const path = require('path'); // Agrega el módulo 'path'
const http = require('http');
const mongoose = require('mongoose');
// Clase 18
const cookieParser = require('cookie-parser')
const session = require('express-session')
// Clase 19 Session-file-storage (persistencia en archivo)
const FileStore = require('session-file-store')
// Clase 19 MongoDB (persistencia en base de datos)
const MongoStore = require('connect-mongo');
// Clase 20 Autenticación y Autorización
const passport = require('passport');
const initializatePassport = require('./config/passport.config');

// Servidor de LocalHost:8080
const app = express();
// Visto process.env.PORT en clase 11 para conectar con Glitch (puerto con variable de entorno). Glitch era para que puedan usar el chat los alumnos, no es necesario.
const puerto = process.env.PORT || 8080; // Si no usa process.env.PORT, usa el valor 8080

//Comandos para poder leer desde el servidor los JSON que le mandemos
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Configuración para servir archivos estáticos desde la carpeta public
app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/public'));

//Clase 18 Middalwares - Persistencia en memoria
app.use(cookieParser('s3cr3t0F1rma')) // "s3cr3t0F1rma" es la "Firma Secreta" que ponemos para validar nuestras Cookies, por si las modifica un usuario en el navegador
// app.use(session({
//     secret: 's3cr3tC0der',
//     resave: true,
//     saveUninitialized: true
// }));

// Clase 19 Middalwares - Persistencia en archivo (FileStore)
// const fileStorage = FileStore(session)
// app.use(session({
//     store: new fileStorage({
//         path: './sessions',
//         ttl: 100,
//         retries: 0
//     }),
//     secret: 's3cr3tC0der',
//     resave: true,
//     saveUninitialized: true
// }));

// Clase 19 Middalwares - Persistencia en base de datos (mongoDB)
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://JoseMMTW99:PASSWORD@josemmtw99.7cp9mo3.mongodb.net/Backend_TF?retryWrites=true&w=majority&appName=JoseMMTW99",
        ttl: 60 * 60 *1000 * 24 //Esto seria un día
    }),
    secret: 's3cr3tC0der',
    resave: true,
    saveUninitialized: true
}));
// Clase 20 Passport
initializatePassport();
app.use(passport.initialize())
app.use(passport.session()) // Passport trabaja en conjunto con el Session de la linea 62

// Conectarse con MongoDB usando Mongoose
const uri = "mongodb+srv://JoseMMTW99:PASSWORD@josemmtw99.7cp9mo3.mongodb.net/Backend_TF?retryWrites=true&w=majority&appName=JoseMMTW99";
mongoose.connect(uri)
  .then(() => {
    console.log("Conexión a la base de datos establecida correctamente");
  })
  .catch((error) => {
    console.error("Error al conectar con la base de datos:", error);
  });


// Guardamos en una constante el servirdor (app.listen)
const httpServer = app.listen(puerto, error => {
    if (error) console.log(error);
    console.log('Server escuchando en puerto 8080');
})

const socketServer = new socketIO.Server(httpServer)

// Middleware para servir el script de Socket.IO
app.get('/socket.io/socket.io.js', (req, res) => {
    // Utiliza el módulo 'path' para construir la ruta al archivo
    res.sendFile(path.join(__dirname, '../../node_modules/socket.io/client-dist/socket.io.js'));
});

// Middleware para servir el script de SweetAlert2
app.get('/sweetalert2/sweetalert2.min.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../node_modules/sweetalert2/dist/sweetalert2.min.js'));
});

// Middleware para servir el archivo CSS de SweetAlert2
app.get('/sweetalert2/sweetalert2.min.css', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../node_modules/sweetalert2/dist/sweetalert2.min.css'));
});

// MIDDLEWARE PARA SUBIR ARCHIVOS (configurado en el archivo "index.html")
app.use('/subir-archivo', uploader.single('myFile'), (req, res) => {
    if (!req.file) {
        return res.send('No se pudo subir el archivo')
    }
    res.send('Archivo subido')
})


// Configuración del motor de plantilla Handlebars
app.engine('handlebars', handlebars.engine());
// Configuro la carpeta de la dirección de mis vistas (plantillas de la carpeta views)
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');


//ENDPOINTS

// http:localhost:8080/
app.use('/', viewsRouter)
// http:localhost:8080/api/users
app.use('/api/users', usersRouter)
// http:localhost:8080/api/users
app.use('/api/products', productsRouter)
// http:localhost:8080/api/carts
app.use('/api/carts', cartsRouter)
// http:localhost:8080/api/cookies
app.use('/cookies', cookiesRouter)
// http:localhost:8080/api/session
app.use('/api/sessions', sessionsRouter)


// Middleware para capturar errores
app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).send('Error 500 en el servidor')
})


// Configuración de Socket.IO (Clase 10)
// socketServer.on('connection', (socket) => {
//     console.log('Nuevo cliente conectado');

//     // Aquí puedes manejar eventos específicos del socket, como 'mensaje', 'desconectar', etc.
//     socket.on('message', (data) => {
//         console.log('Mensaje recibido:', data);
//     });

//     socket.emit('socket_individual', 'Este mensaje solo lo debe recibir los Socket (es un mensaje del Servidor al Cliente)')

//     socket.broadcast.emit('para_todos_menos_el_actual', 'Este evento lo verán todos los Socket conectados menos el actual (por ejemplo en Whatsapp a uno no le cargan su propio mensaje por servidor, sino que le carga a los demás porque uno ya lo mandó)')

//     socketServer.emit('evento_para_todos', 'Este mensaje lo reciben todos los Socket, incluyendo al actual')

//     socket.on('disconnect', () => {
//         console.log('Un cliente se ha desconectado');
//     });

//     // Chat en vivo
//     const messages = [];

//     socket.on('mensaje_cliente', data => {
//         console.log(data);

//         messages.push({id: socket.id, message: data})

//         socketServer.emit(' messages_server', messages)
//     })
// });

// Configuración de Socket.IO (Clase 11)
let messages = [];

socketServer.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('message', data=> {
        console.log('Message data: ', data);

        // Guardo los mensajes
        messages.push(data)

        // Emito los mensajes
        socketServer.emit('messageLogs', messages)
    })
})