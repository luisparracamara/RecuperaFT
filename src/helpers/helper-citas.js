const moment = require('moment');


function verificarUltimaCita(ultimaCita, fechaCita)  {
   let fechaUltimaCita = ultimaCita[0].fecha;
   let ultimaCitaSuma = moment(fechaUltimaCita).add(29, 'minutes').utc();
   let ultimaCitaResta = moment(fechaUltimaCita).subtract(29, 'minutes').utc();
   disponibilidadUltimo = !moment(fechaCita).isBetween(ultimaCitaResta, ultimaCitaSuma, null, '[');  

   return disponibilidadUltimo
}


function verificarProximaCita(proximaCita, fechaCita) {
   let fechaProximaCita = proximaCita[0].fecha;
   let proximaCitaResta = moment(fechaProximaCita).subtract(29, 'minutes').utc();
   let proximaCitaSuma = moment(fechaProximaCita).add(29, 'minutes').utc();
   disponibilidadProximo = !moment(fechaCita).isBetween(proximaCitaResta, proximaCitaSuma, null, '[');   

   return disponibilidadProximo;
}

function dateNow(){
  return moment().utc("-7:00");
}




module.exports = {
   verificarUltimaCita, verificarProximaCita, dateNow
};
