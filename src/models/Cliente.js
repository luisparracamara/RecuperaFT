const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const clienteSchema = new Schema({
    nombre: { type: String, required: true },
    edad: { type: Number, required: true },
    sexo: { type: String, required: true },
    telefono: { type: Number, requirsed: true },
    telefono2: { type: Number },
    redsocial: { type: String },
    comentarios: { type: String },
    
    diagnostico: [{ 
        type: Schema.Types.ObjectId, 
        ref: "Diagnostico" 
    }],

    //tratamiento: { type: Schema.Types.ObjectId, ref: "Tratamiento"},
    //finanzas: { type: Number, required: true, default: "0" }
})

module.exports = mongoose.model('Cliente', clienteSchema);
