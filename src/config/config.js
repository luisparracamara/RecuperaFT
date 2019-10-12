//=================
//Puerto
//=================
port = process.env.PORT || 3000;


//=================
//Entorno
//=================
process.env.NODE_ENV  = process.env.NODE_ENV || "dev";


//=================
//Base de datos
//=================
let urlDB;
let ambiente;
if (process.env.NODE_ENV === "dev") {
    urlDB = process.env.urlDBDev
    ambiente = "Desarrollo";
} else {
    urlDB = process.env.urlDBProd;
    //crear variable de entorno en HEROKU con el comando: heroku config:set urlDBProd='mongodb+srv://cafe-user:luisparra@recuperaft-igqhw.mongodb.net/recuperaft?retryWrites=true&w=majority'
    ambiente = "Producción";
}
process.env.URLDB = urlDB;
process.env.AMBIENTE = ambiente;