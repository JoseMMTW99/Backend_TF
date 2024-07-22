const { connect } = require("mongoose");

// Clase 27
class MongoSingleton {
    static #instance
    constructor() {
        connect(process.env.MONGO_URL)
    }

    static getInstance() {
        if(this.#instance){
            console.log('Base de datos ya conectada')
            return this.#instance;
        }
        this.#instance = new MongoSingleton();
        console.log('Base de datos conectada');
        return this.#instance; 
    }
}

module.exports = MongoSingleton;