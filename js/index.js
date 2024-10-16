let parejas = [];
let torneoData;
let horarios = [];
let parejasIngresadas = 0;
let contadorZonas = {};



torneoData = capturarDatosTorneo();
if (torneoData) {
    horarios = crearOpcionesHora(torneoData);
    console.log('Horarios creados:', horarios);
    ingresarJugadores(torneoData, horarios);
}
console.log('Todas las parejas han sido ingresadas:', parejas);

let zonas = agruparZona(parejas);

console.log("Zonas: ",zonas);
let cruces = agruparZona(generarCruces(zonas))
console.log("Cruces",cruces);


function capturarDatosTorneo() {
    const nombre = prompt('Ingrese la categoría:');
    const fecha = prompt('Ingrese la fecha del torneo (DD-MM-AAAA):');
    
    let cantidadParejas;
    do {
        cantidadParejas = parseInt(prompt('Ingrese la cantidad de parejas (entre 2 y 32):'));
        if (cantidadParejas < 2 || cantidadParejas > 32 || isNaN(cantidadParejas)) {
            alert('La cantidad de parejas debe estar entre 2 y 32.');
        }
    } while (cantidadParejas < 2 || cantidadParejas > 32 || isNaN(cantidadParejas));

    let tiempoPartido;
    do {
        tiempoPartido = parseInt(prompt('Ingrese el tiempo promedio de los partidos en minutos (entre 10 y 120):'));
        if (tiempoPartido < 10 || tiempoPartido > 120 || isNaN(tiempoPartido)) {
           alert('El tiempo de partido debe estar entre 10 y 120 minutos.');
        }
    } while (tiempoPartido < 10 || tiempoPartido > 120 || isNaN(tiempoPartido));

    const desdeHora = prompt('Ingrese la hora de inicio del torneo (HH:MM):');
    const hastaHora = prompt('Ingrese la hora de finalización del torneo (HH:MM):');

    if (!desdeHora || !hastaHora || desdeHora >= hastaHora) {
        alert('La hora de inicio debe ser menor que la hora de finalización.');
        return null;
    }

    let [horaInicio, minutoInicio] = desdeHora.split(':').map(Number);
    let [horaFin, minutoFin] = hastaHora.split(':').map(Number);

    let inicioEnMinutos = horaInicio * 60 + minutoInicio;
    let finEnMinutos = horaFin * 60 + minutoFin;

    let duracionMinutos = finEnMinutos - inicioEnMinutos;

    if (duracionMinutos < 300) {
        alert('El torneo debe tener una duración mínima de 5 horas.');
        return null;
    }

    return { nombre, fecha, cantidadParejas, tiempoPartido, desdeHora, hastaHora };
}




function crearOpcionesHora(torneoData) {
    
    
    
    const { desdeHora, hastaHora, tiempoPartido } = torneoData;
    let [horaDesde, minutoDesde] = desdeHora.split(':').map(Number);
    let horaActual = horaDesde * 60 + minutoDesde;

    let [horaHasta, minutoHasta] = hastaHora.split(':').map(Number);
    let hastaHoraMinutos = horaHasta * 60 + minutoHasta;
    const tiempoZona = tiempoPartido * 3; 

    let opciones = [];

    while (horaActual + tiempoZona <= hastaHoraMinutos) {
        let horaInicio = Math.floor(horaActual / 60);
        let minutosInicio = horaActual % 60;
        let horaFormateadaInicio = `${horaInicio}:${minutosInicio < 10 ? '0' + minutosInicio : minutosInicio}`;

        horaActual += tiempoZona;
        let horaFin = Math.floor(horaActual / 60);
        let minutosFin = horaActual % 60;
        let horaFormateadaFin = `${horaFin}:${minutosFin < 10 ? '0' + minutosFin : minutosFin}`;

        opciones.push({ rango: `de ${horaFormateadaInicio} a ${horaFormateadaFin}` });
    }

    return opciones;
}


function ingresarJugadores(torneoData, horarios) {
   
    while (parejasIngresadas < torneoData.cantidadParejas) {
        let jugador1 = prompt('Ingrese el nombre del primer jugador:');
        let jugador2 = prompt('Ingrese el nombre del segundo jugador:');
        
        console.log('Horarios disponibles:');
        horarios.forEach((hora, index) => {
            console.log(`${index + 1}: ${hora.rango}`);
        });
        let horaSeleccionada
        do{
            horaSeleccionada = parseInt(prompt('Seleccione una zona (número):'));
            if (horaSeleccionada < 1 || horaSeleccionada > horarios.length || isNaN(horaSeleccionada)) {
                alert('Zona no válida. Inténtelo de nuevo.');
                
            }else if (contadorZonas[horaSeleccionada] >= 3) {
                alert(`La zona ${horarios[horaSeleccionada - 1].rango} está llena. Por favor, elija otra zona.`);
                horaSeleccionada = null; 
            }
        }while(horaSeleccionada === null ||horaSeleccionada < 1 || horaSeleccionada > horarios.length || isNaN(horaSeleccionada));



        let pareja = {
            jugador1: jugador1,
            jugador2: jugador2,
            zona: horaSeleccionada,
            rangoHorario:horarios[horaSeleccionada - 1].rango,
        };

        parejas.push(pareja);
        
        parejasIngresadas++;
        contadorZonas[horaSeleccionada] = (contadorZonas[horaSeleccionada] || 0) + 1;

        if (contadorZonas[horaSeleccionada] >= 3) {
            console.log(`La zona ${horarios[horaSeleccionada - 1].rango} está llena.`);
            
        }

        console.log('Pareja cargada:', pareja);
        console.log(`Parejas ingresadas: ${parejasIngresadas}/${torneoData.cantidadParejas}`);
        console.log('Horarios restantes:', horarios);
    }

}

function agruparZona(parejas) {
    return parejas.reduce((zonas, pareja) => {
        const zona = pareja.zona;  
        if (!zonas[zona]) {
            zonas[zona] = []; 
        }
        zonas[zona].push(pareja); 
        return zonas;  
    }, {});  
}

function generarCruces(zonas){
    let cruces = []
    
    for(zona in zonas){
        let parejas = zonas[zona];

        for(let i = 0; i < parejas.length; i ++){
            for ( let j = i + 1 ; j < parejas.length; j++ ){

                cruces.push({
                    partido: `${parejas[i].jugador1} - ${parejas[i].jugador2} VS ${parejas[j].jugador1} - ${parejas[j].jugador2}`,
                    zona:zona  
                })

            }

        }
    }
    return cruces;

}

