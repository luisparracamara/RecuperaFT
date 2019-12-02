ctrl = {};
const { Cliente, Cita } = require("../models/index.js");
const helper = require('../helpers/helper-citas.js');
const moment = require('moment');


ctrl.agregarCliente = async (req, res) => {

  try {
    let fechaHoy = helper.dateNow();
    const { nombre, edad, sexo, telefono, redsocial, comentarios } = req.body;

    let buscarNombre = await Cliente.findOne({ nombre });
    if (buscarNombre != null) {
      return res.status(406).json({
        message: "cliente existente, verificar la información"
      })
      
    }

    let cliente = new Cliente({
      nombre,
      edad,
      sexo,
      fecha: fechaHoy,
      telefono,
      redsocial,
      comentarios
    })

    //BOTON QUE PREGUNTE SI QUIERO CARGAR LOS DATOS DE FULANITO
    //fecha hoy en lugar de fecha ESTO SIRVE PARA PONER ESTOS DATOS QUE TAMBIEN VAN EN CITA
    let ultimaCita = await Cita.find({ estado: "en espera" } && { fecha: { $lte: (fechaHoy) } })
      .sort({ fecha: "desc" }).limit(1);

    if (ultimaCita.length >= 1) {
      if (moment(fechaHoy).isSameOrAfter(ultimaCita[0].fecha) === true) {
        cliente.nombre = ultimaCita[0].nombre;
        cliente.redsocial = ultimaCita[0].redsocial;
        cliente.telefono = ultimaCita[0].telefono;
        cliente.cita = ultimaCita[0]._id;
        cliente.cita.push();
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


ctrl.editarCliente = async (req, res) => {
  const clienteId = req.params.id;
  const { nombre, edad, sexo, telefono, redsocial, comentarios } = req.body;

  try {
    const buscarCliente = await Cliente.findById({ _id: clienteId })
  } catch (error) {
    return res.status(406).json({
      ok: false,
      message: "No existe cliente por lo tanto no es posible editar cliente"
    })
  }


  try {
    buscarNombre = await Cliente.findOne({ nombre });  
    
    if (buscarNombre != null && buscarNombre._id != clienteId) {
        return res.status(500).json({
        ok:false,
        message: "Ya se encuentra un cliente registrado con ese nombre, insertar otro nombre"
      });    
    }
    
    let actualizarCliente = await Cliente.findByIdAndUpdate(clienteId, {
      nombre,
      edad,
      sexo,
      telefono,
      redsocial,
      comentarios
    }, { new: true, runValidators: true })

    return res.status(200).json({
      ok: true,
      message: "Cliente actualizado con éxito",
      actualizarCliente
    })


  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error al editar cliente",
      error
    })
  }
}


ctrl.borrarCliente = async (req, res) => {
  const clienteId = req.params.id;

  try {
    const buscarCliente = await Cliente.findById({ _id: clienteId })

    if (buscarCliente != null) {
      await Cliente.findByIdAndDelete({ _id: clienteId });

      res.status(200).json({
        ok: true,
        message: "Cliente borrado correctamente",
      })

    }else{
      return res.status(500).json({
        ok: false,
        message: "Error al eliminar cliente, no se encontró cliente"
      })
    }
    


  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error al eliminar cliente"
    })
  }
}


ctrl.listarCliente = async (req, res) => {
  try {
    const clientes = await Cliente.find({}).populate("diagnostico");
    if (clientes.length <= 0) {
      return res.status(404).json({
        message: "No hay clientes registrados"
      })
    }

    res.status(302).json({
      clientes
    })

  } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "Error al registrar cliente"
      });
    
  }
}












module.exports = ctrl;