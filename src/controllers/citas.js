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


        let ultimaCita = await Cita.find({ fecha: { $lte: (fechaCita) } } && { estado: "en espera" })
            .sort({ fecha: "desc" }).limit(1).exec();
        
        if (ultimaCita.length >= 1) {
            let fechaUltimaCita = ultimaCita[0].fecha;
            let ultimaCitaRango = moment(fechaUltimaCita).add(29, 'minutes').utc();
            disponibilidadUltimo = !moment(fechaCita).isBetween(fechaUltimaCita, ultimaCitaRango, null, '[');  
        }


        let proximaCita = await Cita.find({ fecha: { $gte: (fechaCita) } } && { estado: "en espera" })
            .sort({ fecha: "asc" }).limit(1).exec();

        if (proximaCita.length >= 1) {
            let fechaProximaCita = proximaCita[0].fecha;
            let proximaCitaRango = moment(fechaProximaCita).subtract(29, 'minutes').utc();
            disponibilidadProximo = !moment(cita.fecha).isBetween(proximaCitaRango, fechaProximaCita, null, '[');
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

module.exports = ctrl;


