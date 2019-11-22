const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const detalleTratamientoSchema = new Schema({
    tratamientoId: { type: Schema.ObjectId, ref: "Tratamiento" },
    servicio: { type: String, required: true },
    cantidad: { type: Number, required: true }
})

module.exports = mongoose.model('DetalleTratamiento', detalleTratamientoSchema);