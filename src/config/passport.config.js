const passport = require('passport')
const local = require('passport-local')
const { UserManagerMongo } = require('../dao/userManagerMongo');
const { createHash, isValidPassword } = require('../utils/bcrypt');
// Clase 22
const jwt = require('passport-jwt')
const { PRIVATE_KEY } = require('../utils/jsonwebtoken');

// Clase 21 (usamos esto en vez de local para la autenticación)
const GithubStrategy = require('passport-github2');

const LocalStrategy = local.Strategy
const userService = new UserManagerMongo();

// Clase 22
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
 
const initializatePassport = () => {

    // CLASE 20

    // Middleware para autenticar username (en realidad el email) y password (la contraseña)
    // passport.use('register', new LocalStrategy({
    //     passReqToCallback: true, // En el Request viene el body (passport quiere acceder al objeto request)
    //     usernameField: 'email'
    // }, async ( req, username, password, done)=> {
    //     const {first_name, last_name} = req.body;
    //     try {
    //         // Verifico si existe el usuario
    //         let userFound = userService.getUserBy({email: username})
    //         if(userFound){
    //             console.log('El usuario ya existe');
    //             return done(null, false)
    //         }
    //         // Creo el usuario
    //         let newUser = {
    //             first_name,
    //             last_name,
    //             email: username,
    //             password: createHash(password)
    //         }
    //         let result = await userService.createUser(newUser)
    //         return done (null, result)
    //     } catch (error) {
    //         return done('Error al registrar el usuario' + error)
    //     }
    // }));

    // passport.use('login', new LocalStrategy({
    //     usernameField: 'email'
    // }, async (username, password, done)=> {
    //     try {
    //         const user = await userService.getUserBy({email: username});
    //         if(!user){
    //             console.log('No existe el usuario');
    //             return done(null, false);
    //         }
    //         if(!isValidPassword(password, {password:user.password})) return done(null, false)
    //         return done (null, user)
    //     } catch (error) {
    //         return done('Error al iniciar sesion' + error)
    //     }
    // }));

    // CLASE 21

//     passport.use(
//         'github', new GithubStrategy({
//         clientID: 'Iv23liSSQyXGcvM6Svsk',
//         clientSecret: '8bca2b023fe874f0a9a452ec752f0773c89c2b1d',
//         callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
//         scope: ['user:email'] // Solicitar acceso al correo electrónico del usuario
//     }, async (accessToken, refreshToken, profile, done) => {
//         try {
//             console.log(profile);
//             let email = profile._json.email;

//             if (!email) {
//                 // Generar un email ficticio basado en el username si no existe
//                 email = `${profile.username}@github.com`;
//             }

//             let user = await userService.getUserBy({ email });

//             if (!user) {
//                 let newUser = {
//                     first_name: profile._json.name || 'Nombre',
//                     last_name: profile._json.name || 'Apellido',
//                     email,
//                     password: '' // La contraseña está vacía porque el usuario se registró a través de GitHub
//                 };
//                 let result = await userService.createUser(newUser);
//                 return done(null, result);
//             } else {
//                 return done(null, user);
//             }
//         } catch (error) {
//             return done(error);
//         }
//     }));

//     passport.serializeUser((user, done) => {
//         done(null, user._id);
//     });

//     passport.deserializeUser(async (id, done) => {
//         try {
//             let user = await userService.getUserBy({ _id: id });
//             done(null, user);
//         } catch (error) {
//             done(error);
//         }
//     });
// };

// CLASE 22
    // Función creada para leer las cookies
    const cookieExtractor = (req) => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['coderCookieToken']; 
        }
        return token;
    }

    // jwt (con jwt no necesitamos usar session)
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))
}

module.exports = initializatePassport;