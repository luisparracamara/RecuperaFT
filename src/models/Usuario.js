const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type:String, required:true},
    rol: {type:String, required:true}
});



module.exports = mongoose.model('Usuario', usuarioSchema);