const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const tratamientoSchema = new Schema({
    duracion: { type: Date, required: true },
    clienteId: { type: Schema.ObjectId, ref: "Cliente" },
    sesiones: { type: Number, required: true },
    paquete: { type: Schema.ObjectId, ref: "Paquete" },
    costo: { type: Number, required: true },
    completado: { type: Boolean, required: true, default: false},
    detalleId: { type: Schema.ObjectId, ref: "DetalleTratamiento" },
})

module.exports = mongoose.model('Tratamiento', tratamientoSchema);
