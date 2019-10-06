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
    ambiente = "Producción";
}
process.env.URLDB = urlDB;
process.env.AMBIENTE = ambiente;