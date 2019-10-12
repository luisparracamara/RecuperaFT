const express = require("express");
const router = express.Router();
const usuarios = require("../controllers/usuarios.js");
const mongoose = require('mongoose');
const checkAuth = require("../middleware/check-auth");
const { validaRegistro }  = require('../middleware/registro-validaciones.js');


//LISTADO DE LAS RUTAS
router.get("/", usuarios.getTodo);
router.post("/registrar", [checkAuth,validaRegistro], usuarios.agregarUsuario);
router.post("/login", usuarios.loginUsuario);


module.exports = router;