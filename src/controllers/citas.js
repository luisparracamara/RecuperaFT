const ctrl = {};
const { Cita } = require("../models/index.js");
const moment = require('moment');
moment.locale('es');
const helper = require('../helpers/helper-citas.js');


ctrl.agregarCita = async (req, res) => {

    try {
        let hoy = moment().utc("-7:00").toISOString();
        let fechaCita = moment(req.body.fecha).toISOString();
        let disponibilidadUltimo = true;
        let disponibilidadProximo = true;


        const cita = new Cita({
            nombre: req.body.nombre,
            telefono: req.body.telefono,
            fecha: fechaCita,
            descripcion: req.body.descripcion,
            medio: req.body.medio,
            redsocial: req.body.redsocial
        });


        if (moment(fechaCita).isBefore(hoy)===true) {
            return res.status(406).json({
                message: "Hora de cita no válida"
            })
        }
    

        let ultimaCita = await Cita.find( { estado: "en espera" } && { fecha: { $lte: (fechaCita) } })
            .sort({ fecha: "desc" }).limit(1);
        
        if (ultimaCita.length >= 1) {
            disponibilidadUltimo = helper.verificarUltimaCita(ultimaCita, fechaCita);
        }


        let proximaCita = await Cita.find( { estado: "en espera" } && { fecha: { $gte: (fechaCita) } })
            .sort({ fecha: "asc" }).limit(1);
            
        if (proximaCita.length >= 1) {
            disponibilidadProximo = helper.verificarProximaCita(proximaCita, fechaCita);
        }

        if (disponibilidadUltimo === true && disponibilidadProximo === true) {

            await cita.save();

            res.status(201).json({
                ok: true,
                cita
            })

        } else {
            return res.status(406).json({
                message: "Hora de cita ocupada, reagendar otra cita(Empalme de citas)"
            })
        }
        

    } catch (error) {
        if (error) {
            return res.status(500).json({
                message: "Error al registrar cita",
                error
            });
        }
    }


}



ctrl.editarCita = async (req, res) => {

    try {
  
        let hoy = moment().utc("-7:00").toISOString();
        let fechaCita = moment(req.body.fecha).toISOString();
        let disponibilidadUltimo = true;
        let disponibilidadProximo = true;
        
        let id = req.params.id;
        const { nombre, telefono, descripcion, estado, medio, redsocial } = req.body;

        if (moment(fechaCita).isBefore(hoy) === true) {
            return res.status(406).json({
                message: "Hora de cita no válida"
            })
        }

        let ultimaCita = await Cita.find( { estado: "en espera" } && { fecha: { $lte: (fechaCita) } } && { _id: { $ne: (id) } })
            .sort({ fecha: "desc" }).limit(1);

        if (ultimaCita.length >= 1) {
            disponibilidadUltimo = helper.verificarUltimaCita(ultimaCita, fechaCita);
        }


        let proximaCita = await Cita.find( { estado: "en espera" } && { fecha: { $gte: (fechaCita) } } && { _id: { $ne: (id) } })
            .sort({ fecha: "asc" }).limit(1);


        if (proximaCita.length >= 1) {
            disponibilidadProximo = helper.verificarProximaCita(proximaCita, fechaCita);
        }


        if (disponibilidadUltimo === true && disponibilidadProximo === true) {

            let citaActualizada = await Cita.findByIdAndUpdate(id, {
                estado,
                nombre,
                telefono,
                fecha: fechaCita,
                descripcion,
                medio,
                redsocial  

            }, { new: true, runValidators: true })

            return res.status(200).json({
                ok: true,
                message: "Cita actualizada con éxito",
                citaActualizada
            })

        } else {
            return res.status(406).json({
                message: "Hora de cita ocupada, reagendar otra cita(Empalme de citas)"
            })
        }


    } catch (error) {
        if (error) {
            return res.status(500).json({
                message: "Error al actualizar cita",
                error
            });
        }
    }

    
}



ctrl.borrarCita = async(req,res) => {

    try {
        let id = req.params.id;
        let usuarioEncontrado = await Cita.findOne({ _id: id });

        if (usuarioEncontrado === null) {
            return res.status(500).json({
                ok: false,
                message: "No se encontró la cita a eliminar"
            })
        }

        await Cita.findByIdAndDelete({ _id: id });

        return res.status(200).json({
            ok: true,
            message: "Cita borrada correctamente",
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error al eliminar cita, no se encontró la cita a eliminar",
            error
        })
    }
   
   
}


ctrl.listarCita = async (req, res) => {
    try {
        let citas = await Cita.find({}).exec()

        if (citas.length <= 0) {
            return res.status(404).json({
                message: "No hay citas registradas"
            })
        }

        res.status(302).json({
            citas
        })

    } catch (error) {
        res.status(500).json({
            message: "Error de usuarios",
            error
        })
    }
}




module.exports = ctrl;


