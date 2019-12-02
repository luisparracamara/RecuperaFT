const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const detalleTratamientoSchema = new Schema({
    sesionId: [{ type: Schema.Types.ObjectId, ref: "Tratamiento" }],
    servicioId: [{ type: Schema.Types.ObjectId, ref: "Servicio" }],
    cantidad: { type: Number, required: true },
    costo: { type: Number, required: true}
})

module.exports = mongoose.model('DetalleTratamiento', detalleTratamientoSchema);