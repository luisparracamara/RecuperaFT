const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const tratamientoSchema = new Schema({
    clienteId: { type: Schema.ObjectId, ref: "Cliente" },
    sesiones: { type: Number, required: true },
    costo: { type: Number, required: true, default: 0},
    estado: { type: Boolean, required: true, default: false},
    diagnosticoId: [{ type: Schema.ObjectId, ref: "Diagnostico" }],
    sesionId: [{ type: Schema.ObjectId, ref: "Sesion" }],
})

module.exports = mongoose.model('Tratamiento', tratamientoSchema);
