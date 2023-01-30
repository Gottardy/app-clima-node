require('dotenv').config()

const { leerInput, mostarMenu, pausa, listadoResultadoBusqueda } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");
require("colors");


const main = async () => {
    const busquedas = new Busquedas();
  let opt = '';
  do {
    opt = await mostarMenu();
    switch (opt) {
      case '1':
        //Mosrtar mensaje
        // console.log(`la opción seleccionada es: ${opt}`);
        const lugar = await leerInput('Ciudad: ');

        //Bucar los lugares
        const lugares = await busquedas.getCiudades(lugar);
        
        //Seleccionar el lugar
        //console.log(lugares);
        const idLugar = await listadoResultadoBusqueda(lugares);
        if (idLugar === '0') continue;

        const lugarSelecciondao = await lugares.find( ciudad => ciudad.id === idLugar);
        
        //Persisitimos el lugar seleccionado en la BD
        busquedas.agregarHistorial(lugarSelecciondao.name);

        //datos del clima
        //console.log(idLugar);
        const climaLugarSeleccionado = await busquedas.getClimaCiudad(lugarSelecciondao.lat, lugarSelecciondao.lng);
        //console.log(climaLugarSeleccionado);

        //Mostar resultados
        console.log('\nInformacón de la Ciudad\n'.green);
        console.log('Ciudad:'.green,lugarSelecciondao.name);
        console.log('Estado del clima:'.green, climaLugarSeleccionado.desc);
        console.log('lat:'.green,lugarSelecciondao.lat);
        console.log('lng:'.green,lugarSelecciondao.lng);
        console.log('Temperatura:'.green,climaLugarSeleccionado.temp);
        console.log('Mínima:'.green,climaLugarSeleccionado.temp_min);
        console.log('Máxima:'.green,climaLugarSeleccionado.temp_max);
        console.log('Sesación Termica:'.green, climaLugarSeleccionado.feels_like);
        console.log('Humedad:'.green, climaLugarSeleccionado.humidity)

        break;

      case '2':
        // console.log(`la opción seleccionada es: ${opt}`);
        // busquedas.historial.forEach((lugar, i)=> {
          busquedas.historialCapitalido.forEach((lugar, i)=> {
            let idx = `${i + 1}.`.green;
            console.log(` ${ idx} ${lugar}`);
        })
        break;
    }
    if (opt !== '0') await pausa();
  } while (opt !== '0');
};

main();
