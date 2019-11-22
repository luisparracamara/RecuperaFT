const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const sesionSchema = new Schema({
    descripcion: { type: String, required: true },
    numeroSesion: { type: Number, required: true },
    deuda: { type: Number, required: true },
    fecha: {type: Date, required: true},
    observaciones: { type: String },
    paqueteId: { type: Schema.ObjectId, ref: "Paquete" }
})

module.exports = mongoose.model('Sesion', sesionSchema);