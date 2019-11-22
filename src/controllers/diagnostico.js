ctrl = {};
const { Diagnostico, Cliente } = require("../models/index.js");
const moment = require('moment');

ctrl.agregarDiagnostico = async (req, res) => {

    let clienteId = req.params.id;
    const { padecimiento, diagnostico } = req.body;
    let fecha = moment().utc("-7:00");

    const nuevoDiagnostico = new Diagnostico({
        diagnostico,
        padecimiento,
        fecha,
        clienteId
    })


    try {
        const buscarCliente = await Cliente.findById({ _id: clienteId })
        buscarCliente.diagnostico.push(nuevoDiagnostico)
        await buscarCliente.save();
    } catch (error) {
        return res.status(406).json({
            ok: false,
            message: "No existe usuario por lo tanto no es posible agregar diagnóstico"
        })
    }


    try {
        await nuevoDiagnostico.save();
        res.status(201).json({
            ok: true,
            message: "Diagnostico guardado con éxito",
            nuevoDiagnostico
        })

    } catch (error) {
        return res.status(406).json({
            ok: false,
            message: "Error al registrar diagnostico"
        })
    }

}

ctrl.editarDiagnostico = async (req, res) => {
    try {
        let diagnosticoId = req.params.id;
        const { padecimiento, diagnostico, clienteId } = req.body;

        let diagnosticoActualizado = await Diagnostico.findByIdAndUpdate(diagnosticoId, {
            clienteId,
            padecimiento,
            diagnostico
        }, { new: true, runValidators: true })

        res.status(200).json({
            ok: true,
            message: "Diagnostico actualizado con éxito",
            diagnosticoActualizado
        })

    } catch (error) {
        return res.status(406).json({
            ok: false,
            message: "Error al actualizar diagnostico"
        })
    }
}


ctrl.borrarDiagnostico = async (req, res) => {
    try {
        let diagnosticoId = req.params.id;
        let diagnosticoEncontrado = await Diagnostico.findOne({ _id: diagnosticoId });
        
        let clienteId = diagnosticoEncontrado.clienteId;
        
        await Diagnostico.findByIdAndDelete({ _id: diagnosticoId });
        await Cliente.findByIdAndUpdate(clienteId, { $pull: { diagnostico: { $in: [diagnosticoId] } } } )

        res.status(200).json({
            ok: true,
            message: "Diagnostico borrado correctamente"
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Error al eliminar diagnostico",
            error
        })
    }
}


ctrl.listarDiagnostico = async (req, res) => {
    try {
        let diagnosticos = await Diagnostico.find({})

        if (diagnosticos.length <= 0) {
            return res.status(404).json({
                message: "No hay diagnosticos registrados"
            })
        }

        res.status(302).json({
            diagnosticos
        })

    } catch (error) {
        res.status(500).json({
            message: "Error al listar diagnostico",
            error
        })
    }
}


module.exports = ctrl;