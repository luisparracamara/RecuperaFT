const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nombre: String,
    apellido: String
});

module.exports = mongoose.model('Usuario', usuarioSchema);