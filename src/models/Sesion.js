const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const sesionSchema = new Schema({
    detalleTratamiento: [{ type: Schema.ObjectId, ref: "DetalleTratamiento" }],
    numeroSesion: { type: Number, required: true, default: 0 },
    abono: { type: Number, required: true, default: 0 },
    fecha: {type: Date, required: true},
    comentarios: { type: String },
    tratamientoId: [{ type: Schema.ObjectId, ref: "Tratamiento" }]
})

module.exports = mongoose.model('Sesion', sesionSchema);