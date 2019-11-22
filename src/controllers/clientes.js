ctrl = {};
const { Cliente, Cita } = require("../models/index.js");
const helper = require('../helpers/helper-citas.js');
const moment = require('moment');


ctrl.agregarCliente = async (req, res) => {

  try {
    let fechaHoy = moment();
    const { nombre, edad, sexo, fecha, telefono, telefono2, redsocial, comentarios } = req.body;


    const cliente = new Cliente({
      nombre,
      edad,
      sexo,
      fecha,
      telefono,
      telefono2,
      redsocial,
      comentarios
    })

    let buscarNombre = await Cliente.findOne({ nombre });

    if (buscarNombre != null) {
      return res.status(406).json({
        message: "cliente existente, verificar la información"
      })
    }

    //fecha hoy en lugar de fecha
    let ultimaCita = await Cita.find({ estado: "en espera" } && { fecha: { $lte: (fecha) } })
      .sort({ fecha: "desc" }).limit(1);

    if (ultimaCita.length >= 1) {
      if (moment(fecha).isSameOrAfter(ultimaCita[0].fecha) === true) {
          cliente.nombre = ultimaCita[0].nombre,
          cliente.redsocial = ultimaCita[0].redsocial
      }
    }


    await cliente.save();

    res.status(201).json({
      ok: true,
      message: "Cliente tregistrado con éxito",
      cliente
    })



  } catch (error) {
    if (error) {
      return res.status(500).json({
        message: "Error al registrar cliente",
        error
      });
    }
  }


}


ctrl.listarCliente = async (req, res) => {
    res.json({
      a: await Cliente.find({}).populate("diagnostico")
    })
}












module.exports = ctrl;