const express = require ('express');
const { Router } = require('express');
const { userModel } = require('../models/users.models');

const router = Router();

let users = [];

// ENDPOINTS USERS CRUD

router.get('/', async (req, res) => {
    try {
        const users = await userModel.find({}); // Usar .find() en lugar de ({})
        res.status(200).send({ status: 'success', payload: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ status: 'error', error: 'Error fetching users' });
    }
})
// Llamo a un usuario
router.get('/:uid', (req, res) => {
    const { uid } = req.params
    const userFound = users.find(user => user.id === parseInt(uid));

    res.send({status: 'succes', payload: userFound})
})
// Creo un usuario
router.post('/', async (req, res) => {
    const { first_name, last_name, email } = req.body;

    if(!email) return res.send({status: 'error', error: 'Faltan campos'})

    // Persistencia en memoria
    // const newUser = {
    //     id: users.length + 1,
    //     first_name,
    //     last_name,
    //     email,
    //     password
    // }
    // users.push(newUser)

    //Persistencia en Mongo Atlas
    const newUser = {
        first_name,
        last_name,
        email
    }
    // Hacer un validador para que no mande a crear uno con un email que ya existe en la Base de Datos
    const result = await userModel.create(newUser)

    res.status(200).send({stratus: 'succes', payload: result});
})
// Actualizo/cambio los datos de un usuario
router.put('/:uid', async (req, res) => {
    const { uid } = req.params
    const { first_name, last_name, email } = req.body;
    if(!first_name || !last_name || !email) return res.send({status: 'error', error: 'Faltan Campos'})
    
    // const userToUpdate = req.body

    // Persistencia en memoria
    // const userIndex = users.findIndex(user => user.id === parseInt(uid))
    // if (userIndex === -1) return res.status(404).send({status: 'error', error: 'user not found'})
    // users[userIndex] = {id: parseInt(uid), ...userToUpdate}
    // users[userIndex] = userToUpdate;

    //res.send({status: 'succes', payload: userToUpdate })


    // Persistencia en Mongo Atlas

    // Forma 1: updateOne
    // Crear objeto para almacenar solo los campos que se van a actualizar
    const updatedFields = {};
    if (first_name) updatedFields.first_name = first_name;
    if (last_name) updatedFields.last_name = last_name;
    if (email) updatedFields.email = email;

    try {
        const result = await userModel.updateOne({ _id: uid }, updatedFields);
        if (result.nModified === 0) {
            // Si el número de documentos modificados es cero, significa que no se actualizó ningún usuario
            return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });
        }
        res.send({ status: 'success', payload: result });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).send({ status: 'error', error: 'Error al actualizar usuario' });
    }
    //Forma 2: findBtIdAndUpdate (veremos mas adelante)
    // const result = await userModel.findByIdAndUpdate({_id:uid}, userToUpdate)
})
// Borro un usuario (esta mal, tengo que terminarle la lógica)
router.delete('/:uid', async (req, res) => {
    const { uid } = req.params;

    // Persistencia en memoria
    // const userResult = users.filter(user => user.id !== parseInt(uid))

    // Persistencia en Mongo Atlas
    const result = await userModel.deleteOne({_id: uid})

    res.send({status: 'succes', payload: result})
})
 

module.exports = router;