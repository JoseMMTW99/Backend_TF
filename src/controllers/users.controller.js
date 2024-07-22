const UserDto = require("../dtos/user.dto");
const { userService } = require("../service");

console.log(userService)

class UsersController {
    constructor() {
        this.userService = userService;
    }

    getUsers = async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 5;
            const numPage = parseInt(req.query.numPage) || 1;
            console.log(await this.userService.getUsers)
            const users = await this.userService.getUsers({ limit, numPage });

            // Extraer datos de paginación
            const { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage } = users;

            res.render('users', {
                styles: "users.css",
                users: docs,
                page,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).send({ status: 'error', error: 'Error fetching users' });
        }
    }

    getUser = async (req, res) => {
        const { uid } = req.params;
        try {
            const userFound = await this.userService.getById(uid);
            if (!userFound) {
                return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });
            }
            res.send({ status: 'success', payload: userFound });
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).send({ status: 'error', error: 'Error fetching user' });
        }
    }

    createUser = async (req, res) => {
        const { first_name, last_name, email, password } = req.body;
        if (!email) return res.send({ status: 'error', error: 'Faltan campos' });

        const newUser = {
            first_name,
            last_name,
            password // Me falta encriptarla
        };

        try {
            // Aquí deberías implementar la lógica para validar si el email ya existe antes de crear un nuevo usuario
            const result = await this.userService.createUser(newUser);
            res.status(200).send({ status: 'success', payload: result });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).send({ status: 'error', error: 'Error creating user' });
        }
    }

    updateUser = async (req, res) => {
        const { uid } = req.params;
        const { first_name, last_name, email } = req.body;
        if (!first_name || !last_name || !email) return res.send({ status: 'error', error: 'Faltan Campos' });

        const updatedFields = {};
        if (first_name) updatedFields.first_name = first_name;
        if (last_name) updatedFields.last_name = last_name;
        if (email) updatedFields.email = email;

        try {
            const result = await this.userService.updateUser(uid, updatedFields);
            if (result.nModified === 0) {
                return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });
            }
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).send({ status: 'error', error: 'Error updating user' });
        }
    }

    deleteUser = async (req, res) => {
        const { uid } = req.params;
        try {
            const result = await this.userService.deleteUser(uid);
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).send({ status: 'error', error: 'Error deleting user' });
        }
    }
}

module.exports = UsersController;