const express = require("express");
const { Router } = require("express");
const auth = require("../../middlewares/auth.middleware");
const { UsersDaoMongo } = require("../../daos/MONGO/usersDaoMongo");
const { createHash, isValidPassword } = require("../../utils/bcrypt");
const passport = require("passport");
const { generateToken, authToken } = require("../../utils/jsonwebtoken");
const passportCall = require("../../utils/passportCall");
const authorization = require("../../utils/authorizationJWT");

const router = Router();

// Endpoints para probar las cookies
// router.get("/login", (req, res) => {
//   if (req.session.counter) {
//     req.session.counter++;
//     res.send(`Se ha visitado el sitio ${req.session.counter} veces`);
//   } else {
//     req.session.counter = 1;
//     res.send("Bienvenidos");
//   }
// });

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) res.send({ status: "error", error: error });
    else return res.render("login");
  });
});

// Ruta para iniciar sesión del administrador
router.post("/loginAdmin", (req, res) => {
  const { email, password } = req.body;
  if (email !== "fede@gmail.com" || password !== 1234) {
    return res.send("Login Failed");
  }

  req.session.user = {
    email,
    admin: true,
  };

  console.log(req.session.user);
  res.send("Login Success");
});

// Ruta para cerrar sesión del administrador
router.get("/logoutAdmin", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.send({ status: "error", error: error });
    } else {
      return res.send("Admin logged out successfully");
    }
  });
});

// Endpoint con autenticación de Administrador
router.get("/adminData", auth, (req, res) => {
  res.send("Datos Sensibles que solo puede ver el admin");
});

// CLASE 19 Register y 21 JWT
const userService = new UsersDaoMongo();

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // Validar si vienen los datos
    if (!email || !password)
      return res
        .status(401)
        .send({ status: "error", error: "Ingrese todos los datos necesarios" });

    // Validar si existe el usuario
    const userExist = await userService.getUserBy({ email });
    if (userExist)
      return res
        .status(401)
        .send({ status: "error", error: "El usuario ya existe" });

    const newUser = {
      first_name,
      last_name,
      email,
      password: createHash(password),
    };

    const result = await userService.createUser(newUser);

    // Clase 21: datos que se guardan dentro del Token
    const token = generateToken({
      id:result._id,
      email:user
    })
    
    res.send({status: 'succes', token});
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // Validar si vienen los datos
    if (!email || !password)
      return res
        .status(401)
        .send({ status: "error", error: "Ingrese todos los datos necesarios" });

    const userFound = await userService.getBy({ email });

    if (!userFound)
      return res
        .status(400)
        .send({ status: "error", error: "Usuario no encontrado" });

    // Comparamos la contraseña ingresada hasheada con la de la base de datos (Clase 20)
    // Esto nos retorna "true" o "false"
    if (!isValidPassword(password, { password: userFound.password }))
      return res
        .status(401)
        .send({ status: "error", error: "Contraseña incorrecta" });

    // Establecer la sesión del usuario
    req.session.user = {
      email: userFound.email,
      admin: userFound.role === "admin", // Si es admin nos devuelve un "true", sino "false"
    };

    console.log("Rol del usuario en sesión:", req.session.user.admin);

    // Clase 21: datos que se guardan dentro del Token
    const token = generateToken({
      id:userFound._id,
      email,
      role: userFound.role
    })

    // Clase 22: guardamos en los cookies los datos del usuario
    res
      .cookie('coderCookieToken',  token, {
        maxAge: 60*60*1000*24,  // Esto sería un día
        httpOnly: true // Esto hace que solo se pueda ver el token desde una consulta http
      })
      .send({status: 'succes', token});
  } catch (error) {
    console.log(error);
  }
});

// CLASE 19

// router.get("/current", auth, (req, res) => {
//   res.send("Datos sensibles");
// });

// CLASE 21 (CURRENT CON JSON WEB TOKEN)

// router.get("/current", authToken, (req, res) => {
//   res.send("Datos sensibles");
// });

// CLASE 22 (CURRENT CON COOKIE Y PASSPORT)

// router.get("/current", passport.authenticate('jwt', {session: false}), (req, res) => {
//   console.log(req.user)
//    res.send("Datos sensibles");
//  });

// CLASE 22 (CURRENT CON COOKIE Y PASSPORT DINAMICO) (NO ME ANDA)
// Primero se ejecuta "/current", desp "passportCall", si paso "passportCall" recien va a "authorization" y si pasa la misma recien se ejecuta y devuelve "Datos sensibles". Los middleware funcionan "paso a paso".
router.get("/current", passportCall('jwt'), authorization('admin'), (req, res) => {
  console.log(req.user)
   res.send("Datos sensibles");
 });

// CLASE 20 (no probado si anda)

// Si falla register (programado en passport.config.js) te redirige a failregister
// router.post('/register', passport.authenticate('register', {failureRedirect:'/failregister'}), async (req, res) => {
//   res.send({status: 'succes', message: 'Usuario Registrado'})
// })

// router.post('/failregister', async (req, res) => {
//   console.log('Error al registrar el usuario');
//   res.send({error: 'failed'})
// })

// // Si falla login (programado en passport.config.js) te redirige a faillogin
// router.post('/login', passport.authenticate('login', {failureRedirect:'/faillogin'}), async (req, res) => {
//   if(!req.user) res.status(400).send({status:'error', error: 'Credenciales inválidas'});
//   req.session.user = {
//     first_name: req.user.first_name,
//     last_name: req.user.last_name,
//     email: req.user.email
//   }
//   res.send({status: 'succes', payload: req.user})
// })

// router.post('/faillogin', (req, res) => {
//   console.log('Error al ingresar el usuario');
//   res.send({error: 'failed'})
// })


// CLASE 21

router.get('/github', passport.authenticate('github', {scope: 'user:email'}, async (req, resp) => {}))


router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  if (!req.user) {
      return res.redirect('/login'); // o maneja el error de alguna otra manera
  }

  if (!req.user.email) {
      // Redirigir a la página donde el usuario puede proporcionar su correo electrónico
      req.session.tempUser = req.user; // Guarda la información temporalmente
      return res.redirect('/complete-profile');
  }
  req.session.user = req.user;
  res.redirect('/');
});


module.exports = router;