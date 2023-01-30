const fs = require("fs");
const axios = require("axios").default;

class Busquedas {
  historial = [];
  dbPath = "./db/db.json";

  constructor() {
    this.leerDB();
  }

  //cargamas los parametros para llamar a la API MAPBOX y la variable de entorno con el token
  get paramsMapBox() {
    return {
      types: "country,region,district,locality,place,neighborhood,address",
      language: "es",
      limit: 5,
      access_token: process.env.MAPBOX_KEY,
    };
  }
  //cargamas los parametros para llamar a la API MAPBOX y la variable de entorno con el token
  get paramsWeatherMap() {
    return {
      units: "metric",
      lang: "es",
      appid: process.env.WEATHER_KEY,
    };
  }

  //
  get historialCapitalido(){
    return this.historial.map( ciudad => {
      let palabras = ciudad.split(' ');
      palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );
      return palabras.join(' ');
    });
  }

  //metodo asincrono que regresa todas las ciudades con el nombre de ese lugar
  async getCiudades(lugar = "") {
    try {
      //peticion http
      const options = {
        method: "GET",
        url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapBox,
      };
      const resp = await axios.request(options);
      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        name: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  //metodo asincrono que regresa el clima de la ciudades con las coordenadas de ese lugar
  async getClimaCiudad(lat, lon) {
    try {
      const options = {
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsWeatherMap, lat, lon },
      };
      const resp = await axios.request(options);
      //console.log(resp.data);
      const { weather, main } = resp.data;
      return {
        desc: weather[0].description,
        temp: main.temp,
        feels_like: main.feels_like,
        temp_min: main.temp_min,
        temp_max: main.temp_max,
        pressure: main.pressure,
        humidity: main.humidity,
      };
    } catch (error) {
      return "no se logro encontrar la ciudad";
    }
  }

  async agregarHistorial(ciudad = "") {
    if (this.historial.includes(ciudad.toLocaleLowerCase())) {
      return;
    }
    this.historial = this.historial.splice(0,5);
    this.historial.unshift(ciudad.toLocaleLowerCase());
    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  leerDB() {
    if (!fs.existsSync(this.dbPath)) {
      return null;
    } else {
      const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
      const Data = JSON.parse(info);
      this.historial = Data.historial;
    }
  }
}

module.exports = Busquedas;
