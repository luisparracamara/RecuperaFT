
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
                errores
            })
        }

        next();

        
    } catch (error) {
        res.status(401).json({
            message: "Error al registrar"
        })
    }
    
}


module.exports = {
    validaRegistro
}
