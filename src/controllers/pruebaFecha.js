const ctrl = {};
const Cita = require('../models/Cita.js');
const moment = require('moment');

ctrl.agregarCita = async (req, res) => {

    console.log("-----------------------------");

    console.log(moment(req.body.fecha).toISOString());
    console.log(moment().utc("-7:00").toISOString());
 
    console.log("--------------------------------"); 
    console.log(moment(hoy).isBefore(fechaCita));
   


    let hoy = moment().utc("-7:00").toISOString();
    let fechaCita = moment(req.body.fecha).toISOString();
    let disponibilidadUltimo;
    let disponibilidadProximo;


    let ultimaCita = await Cita.find({ fecha: { $lte: (fechaCita) } })
        .sort({ fecha: "desc" }).limit(1).exec();
        
    if (ultimaCita.length >= 1) {
        let fechaUltimaCita = ultimaCita[0].fecha;
        let ultimaCitaRango = moment(fechaUltimaCita).add(29, 'minutes').utc();
        disponibilidadUltimo = !moment(fechaCita).isBetween(fechaUltimaCita, ultimaCitaRango, null, '['); //true  
    }else{
        disponibilidadUltimo = true;
    }


    let proximaCita = await Cita.find({ fecha: { $gte: (fechaCita) } })
        .sort({ fecha: "asc" }).limit(1).exec();

    if (proximaCita.length >= 1) {
        let fechaProximaCita = proximaCita[0].fecha;
        let proximaCitaRango = moment(fechaProximaCita).subtract(29, 'minutes').utc();
        disponibilidadProximo = !moment(cita.fecha).isBetween(proximaCitaRango, fechaProximaCita, null, '['); //true
    } else {
        disponibilidadProximo = true;
    }


    const cita = new Cita({
        nombre: req.body.nombre,
        telefono: req.body.telefono,
        fecha: fechaCita,
        descripcion: req.body.descripcion
    });


    if (disponibilidadUltimo === true && disponibilidadProximo === true) {

        //await cita.save();

        res.status(200).json({
            ok: true,
            cita
        })

    } else {
        return res.status(406).json({
            message: "Hora de cita ocupada, reagendar otra cita"
        })
    }
   

 
    
    
    
    
    
    
    


    return res.status(200).json({
        ok: "se completó el proceso"
    })


}


module.exports = ctrl;