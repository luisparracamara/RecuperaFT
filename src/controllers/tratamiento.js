ctrl = {};
const { Tratamiento, DetalleTratamiento, Servicio, Sesion, Cita } = require("../models/index.js");
const moment = require('moment');
const helper = require('../helpers/helper-citas.js');


ctrl.agregarTratamiento = async (req,res) => {
    const id = req.params.id;
    const {sesiones,costoTotal,diagnosticoId} = req.body
    //me interesa agregar la fecha? fecha inicio y fecha termino?
    const nuevoTratamiento = new Tratamiento({
        id,
        sesiones,
        costoTotal,
        diagnosticoId
    })

    await nuevoTratamiento.save();

    res.send("hola");
    
}

ctrl.agregarDetalleTratamiento = async (req,res) => {
    const sesionId = req.params.id;
    const {servicioId,cantidad} = req.body;
    let costo = 0;

    try {
        const buscarSesion = await Sesion.findById( sesionId );
        if (buscarSesion === null) {
            return res.status(404).json({
                ok: false,
                message: "No se encontró id sesion"
            })
        }
    } catch (error) {
        return res.status(404).json({
            ok: false,
            message: "No se encontró id sesion"
        })
    }

    
    
    try {
        const buscarServicio = await Servicio.findById( servicioId );
        costo = buscarServicio.precio; 
        costo = costo * cantidad;
    } catch (error) {
        return res.status(404).json({
            ok: false,
            message: "No se encontró producto o servicio"
        })
    }


    try {
        //hacer array push para que se gurden en la bd
        const nuevoDetalleTratamiento = new DetalleTratamiento({
            sesionId,
            servicioId,
            cantidad,
            costo
        })

        await nuevoDetalleTratamiento.save();

        //agregar ala tabla sesion
        const buscarSesion = await Sesion.findById({ _id: sesionId })
        buscarSesion.detalleTratamiento.push(nuevoDetalleTratamiento)
        await buscarSesion.save();
        

        res.status(200).json({
            ok: true,
            message: "Detalle tratamiento agregado con éxito"
        })

  
    } catch (error) {
        return res.status(404).json({
            ok: false,
            message: "error al agregar"
        })
    }


    
}


ctrl.agregarSesion = async (req, res) => {
    let tratamientoId = req.params.id;
    const {comentarios, numeroSesion, abono, fechaCita} = req.body;
    let disponibilidadUltimo = true;
    let disponibilidadProximo = true;
    
    //VERIFICAR QUE EL NUMERO TOTAL DE SESIONES NO SOBREPASE EL NUMERO DE SESION
    const buscarTratamiento = await Tratamiento.findById(tratamientoId);
    const totalSesiones = buscarTratamiento.sesiones;

    if (totalSesiones < numeroSesion) {
        return res.send("error");
    }

    //VALIDAR QUE LA FECHA DE LA SESION NO SE EMPALME CON ALGUNA CITA

    let ultimaCita = await Cita.find({ estado: "en espera" } && { fecha: { $lte: (fechaCita) } })
        .sort({ fecha: "desc" }).limit(1);

    if (ultimaCita.length >= 1) {
        disponibilidadUltimo = helper.verificarUltimaCita(ultimaCita, fechaCita);
    }    

    let proximaCita = await Cita.find({ estado: "en espera" } && { fecha: { $gte: (fechaCita) } })
        .sort({ fecha: "asc" }).limit(1);

    if (proximaCita.length >= 1) {
        disponibilidadProximo = helper.verificarProximaCita(proximaCita, fechaCita);
    }

    if (disponibilidadUltimo === false && disponibilidadProximo === false) {
        return res.send("error");
    }


    let nuevaSesion = new Sesion({
        tratamientoId,
        numeroSesion,
        abono,
        fecha: fechaCita,
        comentarios
    })

    //await nuevaSesion.save();

    //guardar esta sesion en un tratamiento
    buscarTratamiento.sesionId.push(nuevaSesion)
    //await buscarTratamiento.save();

    //agregar el costo total
    buscarTratamiento.costo = abono
    await buscarTratamiento.save();
    
    
    res.send("hola");

}


module.exports = ctrl;