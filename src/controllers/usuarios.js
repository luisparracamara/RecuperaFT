const ctrl = {}
const bcrypt = require('bcryptjs');
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


ctrl.editarUsuario = async(req,res) => {
  
    try {
      let id = req.params.id
      const { nombre, apellido, username, password, rol } = req.body;

      const buscarUsername = await Usuario.find({ username: username }).exec();

        if (buscarUsername[0]._id != id) {
          return res.status(404).json({
              message: "No se encontró el usuario"
          })
      }
      
        if (buscarUsername.length >= 1 && buscarUsername[0]._id != id) {
          return res.status(409).json({
              message: "Usuario existente, introduzca otro"
          })
      }

       bcrypt.hash(password, 10, async(err, hash) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }   

           let usuarioActualizado =  await Usuario.findByIdAndUpdate(id, {
               nombre,
               apellido,
               username,
               password: hash,
               rol
           }, { new: true, runValidators: true })
           
           return res.status(200).json({
               ok: true,
               message: "Usuario actualizado con éxito",
               usuarioActualizado
           })

        });
    
  } catch (error) {
     return res.status(400).json({
          ok: false,
          message: "Error, intente de nuevo",
          error
      })
  }


}


ctrl.eliminarUsuario = async(req,res) => {
   try {
       let id = req.params.id;

       let usuarioEncontrado = await Usuario.findOne({ _id: id });

       if (usuarioEncontrado != null) {
           await Usuario.findByIdAndDelete({ _id: id });

           res.status(200).json({
               ok: true,
               message: "Usuario borrado correctamente"
           })
       }else{
           res.status(500).json({
               ok: false,
               message: "No se encontró usuario a eliminar"
           })
       }
           
   } catch (error) {
       res.status(500).json({
           ok: false,
           message: "Error al eliminar usuario"
       })
   }
}


ctrl.listarUsuario = async(req,res) => {
    try {
        let usuarios = await Usuario.find({}).exec()

        if (usuarios.length <= 0) {
            return res.status(404).json({
                message: "No hay usuarios registrados"
            })
        }

        res.status(302).json({
            usuarios
        })
        
    } catch (error) {
        res.status(500).json({
            message: "Error de usuarios",
            error
        })
    }
}



ctrl.getTodo = (req, res) => {
    res.send({
        hola: "hola we"
    })
}

module.exports = ctrl;