
const localStrategy = require("passport-local").Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario.js');
const jwt = require('jsonwebtoken');

module.exports = (passport) => {

    passport.use(
        new localStrategy({ usernameField: "username" }, async(username, password, done) => {

            try {
                const loginUsuario = await Usuario.findOne({ username }).exec();

                if (loginUsuario < 1) {
                    return done(null, false, { message: "La contraseña o usuario no coinciden" })
                }

                try {
                    const autentificacion = bcrypt.compareSync(password, loginUsuario.password);

                    if (autentificacion === true) {

                        const token = jwt.sign({
                            username: loginUsuario.username,
                            id: loginUsuario._id,
                            rol: loginUsuario.rol,
                        }, process.env.JWT_KEY, { expiresIn: '1h' })
                        
                        
                        return done(null, loginUsuario, token)
                    } else {
                        return done(null, false, { message: "La contraseña o usuario no coinciden" })
                    }
                } catch (error) {
                    return res.status(401).json({
                        message: "La contraseña o usuario no coinciden",
                    });
                }

            } catch (error) {
                return done(null, false, { message: "La contraseña o usuario no coinciden" })
            }

        })
    );



    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });



}
