
// Captura los datos del torneo


let horaComienzo = 999999999;

let torneoData = capturarDatosTorneo();
let horaTorneo = ingresarFecha();
console.log(torneoData);
console.log(horaTorneo);
cargarJugadores();

function cargarJugadores(){
    console.log("--JUGADORES--")
    for (let i = 0; i < torneoData.cantidadParejas; i++) {
        ingresarJugadores(horaTorneo);
      
    }
}



// Función para capturar datos del torneo
function capturarDatosTorneo() {
    const nombre = prompt('Ingrese el nombre del torneo:');
    const fecha = prompt('Ingrese la fecha del torneo:(dd/mm/aa)');
    let cantidadParejas = parseInt(prompt("¿Cuántas parejas van a ingresar?"));
    const tiempoPartido = parseInt(prompt('Ingrese el tiempo promedio de partido (en minutos):')); 

    return { nombre, fecha, cantidadParejas,tiempoPartido };
}

// Función para ingresar la hora del torneo
function ingresarFecha() {
    while (true) {
        let desdeHora = parseInt(prompt('Ingrese la hora de inicio (en formato 24h, solo número):'));
        let hastHora = parseInt(prompt('Ingrese la hora de finalización (en formato 24h, solo número):'));

        if (desdeHora >= hastHora) {
            alert('La hora de inicio debe ser menor que la hora de finalización. Intente de nuevo.');
        } else {
            return { desdeHora, hastHora };
        }
    }
}

// Función para ingresar los jugadores y validar disponibilidad
function ingresarJugadores(horaTorneo) {
    let jugador1 = prompt("Ingrese el nombre del primer jugador:");
    let jugador2 = prompt("Ingrese el nombre del segundo jugador:");

    while (true) {
        let desde = parseInt(prompt(`Ingrese desde qué hora pueden jugar (Entre las ${horaTorneo.desdeHora} y ${horaTorneo.hastHora}):`));
        let hasta = parseInt(prompt(`Ingrese hasta qué hora pueden jugar (Entre las ${horaTorneo.desdeHora} y ${horaTorneo.hastHora}):`));

        if (horaTorneo.desdeHora <= desde && hasta <= horaTorneo.hastHora) {
            if (hasta - desde >= 3) {
                alert("Disponibilidad aceptada.");
                console.log("Jugador 1: "+jugador1+"/ Jugador 2: "+jugador2 + "/  Desde:"+ desde+" Hasta: "+ hasta);
                break
            } else {
                alert("Debe haber al menos 3 horas de disponibilidad. Intente de nuevo.");
            }
        } else {
            alert("Las horas ingresadas están fuera del horario del torneo. Intente de nuevo.");
        }
    }
}

