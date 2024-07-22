// Clase 25: Cargar las variables de entorno desde el archivo .env
const dotenv = require('dotenv');
const { connect } = require('mongoose');
const program = require('../utils/commander');
const MongoSingleton = require('../utils/MongoSingleton');

const { mode } = program.opts();
dotenv.config({
    path: mode === 'production' ? './.env.production' : './.env.development'
  });

const objectConfig = {
    port: process.env.PORT || 8080, // Si no usa process.env.PORT, usa el valor 8080
    mongo_url: process.env.MONGO_URL,
    jwt_private_key: process.env.JWT_PRIVATE_KEY ,
    persistence: process.env.PERSISTENCE
}

const connectDB = async () => {
    // connect(process.env.MONGO_URL)
    // Clase 27
    MongoSingleton.getInstance()
}

module.exports = {
    objectConfig,
    connectDB
}