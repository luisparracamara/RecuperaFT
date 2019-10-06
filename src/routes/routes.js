const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const usuarios = require("../controllers/usuarios.js");


//LISTADO DE LAS RUTAS
router.get("/", usuarios.getTodo);
router.get("/usuarios", usuarios.agregarUsuario);
router.post("/usuarios", usuarios.agregarUsuario);


module.exports = router;