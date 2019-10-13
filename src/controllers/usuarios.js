const ctrl = {}
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const Usuario = require('../models/Usuario.js');




ctrl.agregarUsuario = async (req, res) => {
    
    try {
        const buscarUsername = await Usuario.find({ username: req.body.username }).exec();
        
        if (buscarUsername.length >= 1) {
            return res.status(409).json({
                message: "Usuario existente"
            });

        }else{
          
            bcrypt.hash(req.body.password, 10, async(err, hash) => {
               
                if (err) {
                    return res.status(500).json({
                        error: "Introduce contraseña"
                    });
                }

                const usuario = new Usuario({
                    nombre: req.body.nombre,
                    apellido: req.body.apellido,
                    username: req.body.username,
                    password: hash,
                    rol: req.body.rol
                });


                try {
                    await usuario.save();
                    
                    res.status(200).json({
                        message: "Usuario creado",
                        usuarioCreado: {
                            ok: true,
                            usuario: usuario.nombre,
                            apellido: usuario.apellido,
                            username: usuario.username,
                            password: usuario.password,
                            rol: usuario.rol,
                            _id: usuario._id,
                            request: {
                                type: "GET",
                                url: "http://localhost:3000/usuarios/" + usuario._id
                            }
                        }
                    })


                } catch (error) {
                    if (error) {
                        return res.status(500).json({
                            message: "Ocurrió un fallo al guardar",
                            error
                        });
                    }
                }
                
            }) // fin bcrypt
        } // fin else
     
    } catch (error) {
        if (error) {
            return res.status(500).json({
                error
            });
        }
    }
                      
}//termina agrgar usuario



ctrl.loginUsuario = async(req,res) => {

    try {
        const loginUsuario = await Usuario.findOne({ username: req.body.username }).exec();

        res.send(loginUsuario.username)
      
    
    } catch (error) {
        return res.status(500).json({
            error
        });
    }  
       
}//fin del login





ctrl.getTodo = (req, res) => {
    res.send({
        hola: "hola we"
    })
}

module.exports = ctrl;