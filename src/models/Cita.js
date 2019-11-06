const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const citaSchema = new Schema({
    nombre: { type: String, required: true },
    telefono: { type: Number, required: true},
    fecha: { type: Date, required: true},
    descripcion: { type: String },
    estado: {type: String, default:"en espera"}
})


module.exports = mongoose.model('Cita', citaSchema);