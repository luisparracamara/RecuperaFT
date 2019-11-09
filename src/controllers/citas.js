const ctrl = {};
const Cita = require('../models/Cita.js');
const moment = require('moment');
moment.locale('es');


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
            descripcion: req.body.descripcion
        });


        if (moment(fechaCita).isBefore(hoy)===true) {
            return res.status(406).json({
                message: "Hora de cita no válida"
            })
        }


        //ERROR , RESTAR MEDIA HORA A CADA FECHA, PARA ABARCAR MEDIA HORA ANTES Y MEDIA HORA DESPÚES DE LA CITA PEDIDA// YA resuelto
    

        let ultimaCita = await Cita.find({ fecha: { $lte: (fechaCita) } } && { estado: "en espera" })
            .sort({ fecha: "desc" }).limit(1).exec();
        
        if (ultimaCita.length >= 1) {
            let fechaUltimaCita = ultimaCita[0].fecha;
            let ultimaCitaSuma = moment(fechaUltimaCita).add(29, 'minutes').utc();
            let ultimaCitaResta = moment(fechaUltimaCita).subtract(29, 'minutes').utc();
            disponibilidadUltimo = !moment(fechaCita).isBetween(ultimaCitaResta, ultimaCitaSuma, null, '[');  
        }


        let proximaCita = await Cita.find({ fecha: { $gte: (fechaCita) } } && { estado: "en espera" })
            .sort({ fecha: "asc" }).limit(1).exec();
            

        if (proximaCita.length >= 1) {
            let fechaProximaCita = proximaCita[0].fecha;
            let proximaCitaResta = moment(fechaProximaCita).subtract(29, 'minutes').utc();
            let proximaCitaSuma = moment(fechaProximaCita).add(29, 'minutes').utc();
            disponibilidadProximo = !moment(fechaCita).isBetween(proximaCitaResta, proximaCitaSuma, null, '[');         
        }


        if (disponibilidadUltimo === true && disponibilidadProximo === true) {

            await cita.save();

            res.status(200).json({
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
        const { nombre, telefono, descripcion, estado } = req.body;

        if (moment(fechaCita).isBefore(hoy) === true) {
            return res.status(406).json({
                message: "Hora de cita no válida"
            })
        }

        let ultimaCita = await Cita.find({ fecha: { $lte: (fechaCita) } } && { estado: "en espera" } && { _id: { $ne: (id) } })
            .sort({ fecha: "desc" }).limit(1).exec();

        if (ultimaCita.length >= 1) {
            let fechaUltimaCita = ultimaCita[0].fecha;
            let ultimaCitaSuma = moment(fechaUltimaCita).add(29, 'minutes').utc();
            let ultimaCitaResta = moment(fechaUltimaCita).subtract(29, 'minutes').utc();
            disponibilidadUltimo = !moment(fechaCita).isBetween(ultimaCitaResta, ultimaCitaSuma, null, '[');
        }


        let proximaCita = await Cita.find({ fecha: { $gte: (fechaCita) } } && { estado: "en espera" } && { _id: { $ne: (id) } })
            .sort({ fecha: "asc" }).limit(1).exec();


        if (proximaCita.length >= 1) {
            let fechaProximaCita = proximaCita[0].fecha;
            let proximaCitaResta = moment(fechaProximaCita).subtract(29, 'minutes').utc();
            let proximaCitaSuma = moment(fechaProximaCita).add(29, 'minutes').utc();
            disponibilidadProximo = !moment(fechaCita).isBetween(proximaCitaResta, proximaCitaSuma, null, '[');
        }


        if (disponibilidadUltimo === true && disponibilidadProximo === true) {

            let citaActualizada = await Cita.findByIdAndUpdate(id, {
                nombre,
                telefono,
                fecha: fechaCita,
                descripcion,
                estado
            }, { new: true, runValidators: true })

            return res.status(200).json({
                ok: true,
                message: "Cita actualizada con éxito",
                citaActualizada,
                ultimaCita,
                proximaCita
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

        if (usuarioEncontrado.length >= 1) {
            await Cita.findByIdAndDelete({ _id: id });

            res.status(200).json({
                ok: true,
                message: "Cita borrada correctamente",
            })
        } else {
            res.status(500).json({
                ok: false,
                message: "No se encontró la cita a eliminar"
            })
        }
        
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


