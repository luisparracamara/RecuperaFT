const express = require("express");
const router = express.Router();

const { verificaToken, verificaAdminRol} = require("../middleware/check-auth");
const { validaRegistro, validarCita, validarServicio, validarCliente, validarDiagnostico, validarDetalleTratamiento }  = require('../middleware/validaciones.js');

const { usuarios, login, citas, servicios, clientes, diagnostico, tratamiento, detalleTratamiento} = require('../controllers/index.js');

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
router.post("/citas", [validarCita], citas.agregarCita);
router.put("/citas/:id", [validarCita], citas.editarCita);
router.delete("/citas/:id",  citas.borrarCita);
router.get("/citas", [verificaToken], citas.listarCita)

//SERVICIO
router.post("/servicios", [validarServicio], servicios.agregarServicio);
router.put("/servicios/:id", [verificaToken,validarServicio], servicios.editarServicio);
router.delete("/servicios/:id", [verificaToken], servicios.borrarServicio);
router.get("/servicios", [verificaToken], servicios.listarServicio);

//CLIENTES
router.post("/clientes", [validarCliente], clientes.agregarCliente);
router.put("/clientes/:id", clientes.editarCliente);
router.delete("/clientes/:id", clientes.borrarCliente);
router.get("/clientes", clientes.listarCliente);


//DIAGNOSITCO
router.post("/diagnostico/:id", [validarDiagnostico], diagnostico.agregarDiagnostico);
router.put("/diagnostico/:id", [validarDiagnostico], diagnostico.editarDiagnostico);
router.delete("/diagnostico/:id", diagnostico.borrarDiagnostico);
router.get("/diagnostico/", diagnostico.listarDiagnostico);

//TRATAMIENTO
router.post("/tratamiento/:id", tratamiento.agregarTratamiento);
router.post("/sesion/:id", tratamiento.agregarSesion);

//DETALLE TRATAMIENTO
router.post("/detalle/:id", [validarDetalleTratamiento], detalleTratamiento.agregarDetalleTratamiento);
router.put("/detalle/:id", detalleTratamiento.editarDetalleTratamiento);
router.delete("/detalle/:id", detalleTratamiento.borrarDetalleTratamiento);
router.get("/detalle", detalleTratamiento.listarDetalleTratamiento);

//login con passport
router.post("/login2", login.login2);


module.exports = router;