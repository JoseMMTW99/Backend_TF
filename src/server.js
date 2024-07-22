const express = require('express');
const handlebars = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const initializatePassport = require('./config/passport.config');
const { objectConfig, connectDB } = require('./config/index');
const routerApp = require('./routes/index');
const path = require('path');
const mongoose = require('mongoose');
const FileStore = require('session-file-store')(session);
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors')

const app = express();
const { port } = objectConfig;

// Conectar con la base de datos MongoDB usando Mongoose (con la clase 27 suplantamos esto, gracias a MongoSingleton.js)
// const uri = "mongodb+srv://JoseMMTW99:PublicA%21160499@josemmtw99.7cp9mo3.mongodb.net/Backend_Clases?retryWrites=true&w=majority&appName=JoseMMTW99";
// mongoose.connect(uri)
//   .then(() => {
//     console.log("Conexión a la base de datos establecida correctamente");
//   })
//   .catch((error) => {
//     console.error("Error al conectar con la base de datos:", error);
//   });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/public'));
app.use(cookieParser('s3cr3t0F1rma')); // Clase 18 Middalwares - Persistencia en memoria
app.use(cors()); // Clase 27 Cors

// Configuración de express-session con MongoStore
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://JoseMMTW99:PublicA%21160499@josemmtw99.7cp9mo3.mongodb.net/Backend_Clases?retryWrites=true&w=majority&appName=JoseMMTW99",
        ttl: 60 * 60 * 1000 * 24 // 1 día en milisegundos
    }),
    secret: 's3cr3tC0der',
    resave: true,
    saveUninitialized: true
}));

initializatePassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(routerApp);

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
        mongoUrl: "mongodb+srv://JoseMMTW99:PublicA%21160499@josemmtw99.7cp9mo3.mongodb.net/Backend_Clases?retryWrites=true&w=majority&appName=JoseMMTW99",
        ttl: 60 * 60 *1000 * 24 //Esto seria un día
    }),
    secret: 's3cr3tC0der',
    resave: true,
    saveUninitialized: true
}));

// Conectarse con MongoDB usando Mongoose
// const uri = "mongodb+srv://JoseMMTW99:PublicA%21160499@josemmtw99.7cp9mo3.mongodb.net/Backend_Clases?retryWrites=true&w=majority&appName=JoseMMTW99";
// mongoose.connect(uri)
//   .then(() => {
//     console.log("Conexión a la base de datos establecida correctamente");
//   })
//   .catch((error) => {
//     console.error("Error al conectar con la base de datos:", error);
//   });


// Guardamos en una constante el servirdor (app.listen)
const httpServer = app.listen(port, error => {
    if (error) console.log(error);
    console.log('Server escuchando en puerto ' + port);
})

const socketServer = new socketIO.Server(httpServer)

// Middleware para servir el script de Socket.IO
app.get('/socket.io/socket.io.js', (req, res) => {
    // Utiliza el módulo 'path' para construir la ruta al archivo
    res.sendFile(path.join(__dirname, '../../node_modules/socket.io/client-dist/socket.io.js'));
});

// Middleware para servir el script de SweetAlert2
app.get('/sweetalert2/sweetalert2.min.js', (req, res) => {
    // Utiliza el módulo 'path' para construir la ruta al archivo
    res.sendFile(path.join(__dirname, '../../node_modules/sweetalert2/dist/sweetalert2.min.js'));
});

// Middleware para servir el archivo CSS de SweetAlert2
app.get('/sweetalert2/sweetalert2.min.css', (req, res) => {
    // Utiliza el módulo 'path' para construir la ruta al archivo
    res.sendFile(path.join(__dirname, '../../node_modules/sweetalert2/dist/sweetalert2.min.css'));
});

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