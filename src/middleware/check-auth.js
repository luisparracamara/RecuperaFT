const  jwt = require('jsonwebtoken');

let verificaToken = (req,res,next) => {
    try {
        //obtener el token desde header, quitar el bearer con split
        const token = req.headers.autorizar.split(" ")[1];
        //console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        //console.log(req.userData);
        next();
    } catch (error) {
        res.status(401).json({
            message: "Autentificación erronea"
        })
    }
}



let verificaAdminRol = (req, res, next) => {
    const token = req.headers.autorizar.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    
    if (req.userData.rol === "ADMIN") {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: "El usuario no es administrador"
            }
        })
    }
}



module.exports =  {
    verificaToken,
    verificaAdminRol
}