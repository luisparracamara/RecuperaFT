ctrl = {};
const { Servicio } = require("../models/index.js");


ctrl.agregarServicio =  async(req, res) => {
    
    try {
        const { nombre, precio, descripcion } = req.body;

        let servicioRepetido = await Servicio.findOne({ nombre });

        if (servicioRepetido != null) {
            return res.status(406).json({
                ok: false,
                message: 'Error, ya existe un servicio con el mismo nombre'
            })
        }
        
        const servicio = new Servicio({
            nombre,
            precio,
            descripcion
        })

        await servicio.save();

       return res.status(201).json({
            ok: true,
            message: "Servicio agregado con éxito",
            servicio
        })


    } catch (error) {
       return res.status(500).json({
            ok: false,
            message: "Error al guardar servicio",
            error
        })
    }
    
};


ctrl.editarServicio = async (req, res) => {
    
   try {
       let id = req.params.id;
       const { nombre, precio, descripcion } = req.body;

       let servicioEncontrado = await Servicio.findOne({ _id: id });
       if (servicioEncontrado === null) {
           return res.status(406).json({
               ok: false,
               message: "No se encontró el servicio"
           })
       }

       let actualizarServicio = await Servicio.findByIdAndUpdate(id, {
           nombre,
           precio,
           descripcion
       },{ new: true, runValidators: true })

       return res.status(200).json({
           ok: true,
           message: "Servicio actualizada con éxito",
           actualizarServicio
       })


   } catch (error) {
       return res.status(500).json({
           ok: false,
           message: "Error al editar servicio",
           error
       })
   }

}



ctrl.borrarServicio = async(req,res) => {

    try {
        let id = req.params.id;
        let servicioEncontrado = await Servicio.findOne({ _id: id });
        
        if (servicioEncontrado === null) {
            return res.status(406).json({
                ok: false,
                message: "No se encontró el servicio a eliminar"
            })
        }

        await Servicio.findByIdAndDelete({ _id: id });

        res.status(200).json({
            ok: true,
            message: "Servicio borrado correctamente",
        })

        
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error al eliminar servicio",
            error
        })
    }

}


ctrl.listarServicio = async (req, res) => {
    try {
        let servicios = await Servicio.find({})

        if (servicios.length <= 0) {
            return res.status(404).json({
                message: "No hay servicios registrados"
            })
        }

        res.status(302).json({
            servicios
        })

    } catch (error) {
        res.status(500).json({
            message: "Error de usuarios",
            error
        })
    }
}





module.exports = ctrl;