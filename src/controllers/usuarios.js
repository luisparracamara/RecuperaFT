const ctrl = {}

const Usuario = require('../models/Usuario.js');

ctrl.agregarUsuario = async(req,res) => {

    const usuario = new Usuario({
        nombre: req.body.nombre,
        apellido: req.body.apellido
    });
   await usuario.save(), () => {
        if (err) return handleError(err);
    };

    res.json({
        mensaje: "hola",
        nuevoUsuario: usuario
    })
}




ctrl.getTodo = (req,res) => {
    res.send({
        hola: "hola we"
    })
}

module.exports = ctrl;