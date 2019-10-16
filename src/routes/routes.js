const express = require("express");
const router = express.Router();

const { verificaToken, verificaAdminRol} = require("../middleware/check-auth");
const { validaRegistro }  = require('../middleware/registro-validaciones.js');

const usuarios = require("../controllers/usuarios.js");
const login = require("../controllers/login.js");
const citas = require("../controllers/citas.js");


//LISTADO DE LAS RUTAS

//USUARIOS
router.get("/", usuarios.getTodo);
router.post("/registrar", [verificaToken,verificaAdminRol,validaRegistro], usuarios.agregarUsuario);
router.put("/registrar/:id", [verificaToken, verificaAdminRol, validaRegistro], usuarios.editarUsuario);
router.delete("/registrar/:id", [verificaToken, verificaAdminRol],usuarios.eliminarUsuario);
router.get("/usuarios", [verificaToken, verificaAdminRol], usuarios.listarUsuario);


//CITAS



router.post("/login", login.loginUsuario);

//login con passport
router.post("/login2", login.login2);


module.exports = router;