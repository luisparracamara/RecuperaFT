const moment = require('moment');
const lenguaje = moment.locale('es');


let validaRegistro = (req, res, next) => {
    
    try {
        const errores = [];

        if (!req.body.nombre) {
            errores.push({
                message: "Introduzca nombre"
            })
        }

        if (!req.body.apellido) {
            errores.push({
                message: "Introduzca apellido"
            })
        }

        if (!req.body.username) {
            errores.push({
                message: "Introduzca nombre de usuario"
            })
        }

        if (!req.body.password) {
            errores.push({
                message: "Introduzca contraseña"
            })
        }

        if (req.body.rol != "ADMIN" && req.body.rol != "EMPLEADO") {
            errores.push({
                message: "Introduzca un rol válido"
            })
        }


        if (errores.length >= 1) {
            return res.status(401).json({
                ok: false,
                errores,
                datos: {
                    nombre: req.body.nombre,
                    apellido: req.body.apellido,
                    username: req.body.username,
                    password: req.body.password,
                    rol: req.body.rol
                }
            })
        }

        next();

        
    } catch (error) {
        res.status(401).json({
            message: "Error al registrar"
        })
    }
    
}




let validarCita = (req,res,next) => {
    try {
        const errores = [];

        if (!req.body.nombre) {
            errores.push({
                message: "Introduzca nombre"
            })
        }

        if (!req.body.telefono || !Number(req.body.telefono) ) {
            errores.push({
                message: "Introduzca un teléfono válido"
            })
        }


        if (!req.body.fecha || moment([req.body.fecha]).isValid() === false) {
            errores.push({
                message: "Introduzca una fecha válida"
            })
        }
        

        if (errores.length >= 1) {
            return res.status(401).json({
                ok: false,
                errores,
                datos:{
                    nombre: req.body.nombre,
                    telefono: req.body.telefono,
                    fecha: req.body.fecha,
                    descripcion: req.body.descripcion
                }
            })
        }
        next();


    } catch (error) {
        res.status(401).json({
            message: "Error al registrar cita"
        })
    }
}



let validarServicio = (req, res, next) => {
    try {

        const errores = [];

        if (!req.body.nombre) {
            errores.push({
                message: "Introduzca nombre"
            })
        }

        if (!req.body.precio || !Number(req.body.precio)) {
            errores.push({
                message: "Introduzca un precio válido"
            })
        }


        if (errores.length >= 1) {
            return res.status(401).json({
                ok: false,
                errores,
                datos: {
                    nombre: req.body.nombre,
                    telefono: req.body.precio,
                    descripcion: req.body.descripcion
                }
            })
        }
        next();
        
    } catch (error) {
        res.status(401).json({
            message: "Error al registrar servicio"
        })
    }
}




module.exports = {
    validaRegistro,
    validarCita,
    validarServicio
}
