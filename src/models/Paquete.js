const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const paqueteSchema = new Schema({
    tratamientoId: { type: Schema.ObjectId, ref: "Tratamiento" },
    cantidadSesiones: { type: Number, required: true },
})

module.exports = mongoose.model('Paquete', paqueteSchema);