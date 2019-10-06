const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require('mongoose');

const config = require("./config/config.js");
const routes = require("./routes/routes.js");
const middleware = require("./middleware/error.js");

const app = express();


//configuraciones
app.set("puerto", port);


//middlewares
app.use(morgan('dev'));

//leer lo que llega del body
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//Sirve para poder preveneir el CORS ERROR del navegador y el frontend pueda comunicarse
//Access-Control-Allow-Origin: Para controlar quien puede consumir mi API
//Access - Control - Allow - Headers: Para configurar los headers que acepta la API
//Access - Control - Allow - Methods: Para declarar los métodos que acepta el API
app.use((req,res,next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Acces-Control-Allow-Headers", "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-COntrol-Allow-Request-Method");

    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});



//rutas
app.use(require("./routes/routes.js"));


//manejador de errores de rutas
app.use(middleware.primer);
app.use(middleware.segundo);

//Conectarse a la base de datos
mongoose.connect('mongodb+srv://luis:luisparra@recuperaft-igqhw.mongodb.net/admin?retryWrites=true&w=majority?authSource=admin', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});



app.listen(port, () => {
    console.log(`Server en puerto ${port}`);
    console.log(process.env.ambiente);
})



