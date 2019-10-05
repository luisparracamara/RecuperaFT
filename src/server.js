const express = require("express");
const dotenv = require("dotenv").config();

const app = express();

port = process.env.PORT || 3000;

//configuraciones
app.set("puerto", port);

app.listen(port, () => {
    console.log(`Server en puerto ${port}`);
    
})

