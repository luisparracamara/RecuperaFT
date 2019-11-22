const ctrl = {}
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require("../models/index.js");
const passport = require("passport");


ctrl.loginUsuario = async (req, res) => {

    try {
        const loginUsuario = await Usuario.findOne({ username: req.body.username }).exec();

        if (loginUsuario < 1) {
            return res.status(401).json({
                message: "La contraseña o usuario no coinciden"

            });
        }


        try {
            const autentificacion = bcrypt.compareSync(req.body.password, loginUsuario.password);

            if (autentificacion === true) {

                const token = jwt.sign({
                    username: loginUsuario.username,
                    id: loginUsuario._id,
                    rol: loginUsuario.rol,
                }, process.env.JWT_KEY, { expiresIn: '1h' })

                return res.status(200).json({
                    message: "Autenticación válida",
                    token
                });
            } else {
                return res.status(401).json({
                    message: "La contraseña o usuario no coinciden"
                });
            }
        } catch (error) {
            return res.status(401).json({
                message: "La contraseña o usuario no coinciden",
            });
        }



    } catch (error) {
        return res.status(500).json({
            error
        });
    }

}//fin del login


ctrl.login2 = (req, res, next) => {

    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login2"
    })(req, res, next);

}

ctrl.logout = (req, res) => {
    req.logout();
    res.redirect("/");
}



module.exports = ctrl;