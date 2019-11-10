const express = require("express");
const router = express.Router();

const { verificaToken, verificaAdminRol} = require("../middleware/check-auth");
const { validaRegistro, validarCita, validarServicio }  = require('../middleware/validaciones.js');

const usuarios = require("../controllers/usuarios.js");
const login = require("../controllers/login.js");
const citas = require("../controllers/citas.js");
const servicios = require("../controllers/servicios.js");


//LISTADO DE LAS RUTAS

//LOGIN
router.post("/login", login.loginUsuario);

//USUARIOS
router.get("/", usuarios.getTodo);
router.post("/registrar", [verificaToken,verificaAdminRol,validaRegistro], usuarios.agregarUsuario);
router.put("/registrar/:id", [verificaToken, verificaAdminRol, validaRegistro], usuarios.editarUsuario);
router.delete("/registrar/:id", [verificaToken, verificaAdminRol],usuarios.eliminarUsuario);
router.get("/usuarios", [verificaToken, verificaAdminRol], usuarios.listarUsuario);

//CITAS
router.post("/citas", [verificaToken, validarCita], citas.agregarCita);
router.put("/citas/:id", [verificaToken, validarCita], citas.editarCita);
router.delete("/citas/:id",  citas.borrarCita);
router.get("/citas", [verificaToken], citas.listarCita)

//SERVICIO
router.post("/servicios", [verificaToken,validarServicio], servicios.agregarServicio);
router.put("/servicios/:id", [verificaToken,validarServicio], servicios.editarServicio);
router.delete("/servicios/:id", [verificaToken], servicios.borrarServicio);
router.get("/servicios", [verificaToken], servicios.listarServicio);

//CLIENTES



//login con passport
router.post("/login2", login.login2);


module.exports = router;