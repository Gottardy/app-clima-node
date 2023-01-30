const inquirer = require("inquirer");
require("colors");

const preguntas = [
  {
    type: "list",
    name: "opcion",
    message: "¿Que desea hacer?",
    choices: [
      { value: '1', name: `${'1'.green}.Buscar Ciudad` },
      { value: '2', name: `${'2'.green}.Historial` },
      { value: '0', name: `${'0'.green}.Salir` },
    ],
  },
];

const mostarMenu = async () => {
  console.log("============================".green);
  console.log("  Selecione una opcción".green);
  console.log("============================\n".green);

  const prompt = inquirer.createPromptModule();
  const { opcion } = await prompt(preguntas);
  return opcion;
};

const pausa = async() =>{
    const esperar = [
        {
            type: "input",
            name: "enter",
            message: `Presione ${'Enter'.blue} para continuar`
        }];

    const prompt = inquirer.createPromptModule();
    console.log("\n");
    await prompt(esperar);
};

const leerInput = async( message ) =>{
    const pregunta = [{
        type: 'input',
        name: 'desc',
        message,
        validate( value){
            if (value.length === 0) {
               return 'Por favor ingrese un valor' ;
            }
            return true;
        }
    }];

    const prompt = inquirer.createPromptModule();
    const { desc } = await prompt(pregunta);
    return desc;
}


const listadoResultadoBusqueda = async(lugares=[]) => {
  
    const choices = lugares.map((lugar, index) =>
      { 
        const id = index+1;
        return {
          value: lugar.id, 
          name: `${id.toString().green}. ${lugar.name}`,
        }
      }
    );

    choices.unshift({
      value: '0',
      name: '0.'.green + ' Cancelar'
    });

    const pregunta = [
      {
        type: 'list',
        name: 'id',
        message: 'Seleccione lugar:',
        choices
      }
    ];

    const prompt = inquirer.createPromptModule();
    const { id } = await prompt(pregunta);
    return id;

  };


  const confirmacion = async(mensaje) =>{
    const pregunta = [{
      type: 'confirm',
      name: 'ok',
      message: mensaje,
      }];
      const prompt = inquirer.createPromptModule();
      const { ok } = await prompt(pregunta);
      return ok;
  }


module.exports = {
  mostarMenu,
  pausa,
  leerInput,
  listadoResultadoBusqueda,
  confirmacion,
};
