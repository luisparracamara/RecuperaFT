const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const diagnosticoSchema = new Schema({
    diagnostico: { type: String, required: true },
    padecimiento: { type: String, required: true },
    fecha: { type: Date, required: true },
    clienteId: [{
        type: Schema.Types.ObjectId,
        ref: "Cliente"
    }],
})

module.exports = mongoose.model('Diagnostico', diagnosticoSchema);
