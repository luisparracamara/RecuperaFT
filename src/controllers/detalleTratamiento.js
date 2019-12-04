ctrl = {}
const { DetalleTratamiento, Servicio, Sesion } = require("../models/index.js");


ctrl.agregarDetalleTratamiento = async(req,res) => {
    
    const sesionId = req.params.id;
    const { servicioId, cantidad } = req.body;
    let costo = 0;


    try {
        const buscarSesion = await Sesion.findById(sesionId); 
    } catch (error) {
        return res.status(404).json({
            ok: false,
            message: "No se encontró id sesion"
        })
    }

    try {
        const buscarServicio = await Servicio.findById(servicioId);
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
        let buscarSesion = await Sesion.findById({ _id: sesionId });
        buscarSesion.detalleTratamiento.push(nuevoDetalleTratamiento);
        await buscarSesion.save()
        
        return res.status(200).json({
            ok: true,
            message: "Detalle tratamiento agregado con éxito",
            nuevoDetalleTratamiento
        })


    } catch (error) {
        return res.status(404).json({
            ok: false,
            message: "error al agregar detalle",
            error
        })
    }
}

ctrl.editarDetalleTratamiento = async (req, res) => {
    const detalleId = req.params.id;
    const {sesionId,servicioId,cantidad} = req.body;
    let costo;

    try {
        const buscarDetalle = await DetalleTratamiento.findById(detalleId);
    } catch (error) {
        return res.status(500).json({ok: false, message: "No se encontró id del detalle"})
    }

    try {
        const buscaSesion = await Sesion.findById(sesionId);
    } catch (error) {
        return res.status(500).json({ ok: false, message: "No se encontró id de la sesión" })
    }

    try {
        const buscarServicio = await Servicio.findById(servicioId);
        costo = buscarServicio.precio * cantidad;
    } catch (error) {
        return res.status(500).json({ ok: false, message: "No se encontró id del servicio" })
    }


    try {
        let detalleActualizado = await DetalleTratamiento.findByIdAndUpdate(detalleId, {
            sesionId,
            servicioId,
            cantidad,
            costo
        },{ new: true, runValidators: true })

        res.status(200).json({
            ok: true,
            message: "Detalle actualizado con éxito",
            detalleActualizado
        })
    } catch (error) {
        return res.status(500).json({ ok: false, message: "Error al editar detalle tratamiento" })
    }
 
}


ctrl.borrarDetalleTratamiento = async (req, res) => {
    const detalleId = req.params.id;
    
    try {
        let detalleEncontrado = await DetalleTratamiento.findOne({ _id: detalleId });
        let sesionId = detalleEncontrado.sesionId;

        await DetalleTratamiento.findByIdAndDelete({ _id: detalleId });
        await Sesion.findByIdAndUpdate(sesionId, { $pull: { detalleTratamiento: { $in: [detalleId] } } })

        res.status(200).json({
            ok: true,
            message: "Detalle tratamiento borrado correctamente"
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: "Error al eliminar diagnostico"
        })
    }
}


ctrl.listarDetalleTratamiento = async (req, res) => {
    try {
        let detalleTratamiento = await DetalleTratamiento.find({});
        if (detalleTratamiento.length <= 0) {
            return res.status(404).json({
                message: "No hay detalles Tratamiento registrados"
            })
        }

        res.status(302).json({
            detalleTratamiento
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error al listar detalle tratamientos",
            error
        })
    }
    
}



module.exports = ctrl;