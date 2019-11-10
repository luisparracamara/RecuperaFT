const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const servicioSchema = new Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    descripcion: { type: String }
})

module.exports = mongoose.model('Servicio', servicioSchema);
