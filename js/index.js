let parejas = [];
let torneoData;
let horarios = [];
let parejasIngresadas = 0;
let contadorZonas = {};
let selectHorarios;
let btonFormularioPareja;
let zonaDeCuatro;
let zonaDeTres;
fomularioTorneoData = document.getElementById('crear-torneo');
botonTorneoData = document.getElementById('submit-torneo-data');
formularioParejas = document.getElementById('ingresa-jugador');
grillaJugadores = document.getElementById('grilla-jugadores')


botonTorneoData.addEventListener('click', function(event) {
   
    torneoData = capturarDatosTorneo(event);
    console.log(torneoData);
    horarios = crearOpcionesHora(torneoData);
    console.log('Horarios creados:', horarios);
    crearFormularioJugadores(horarios);
    
});



function verificarZonas(cantidadParejas) {
    let totalZonasDeTres, totalZonasDeCuatro;

    if (cantidadParejas % 3 === 0) {
        totalZonasDeTres = cantidadParejas / 3;
        totalZonasDeCuatro = 0;
    } else if (cantidadParejas % 3 === 1) {
        totalZonasDeTres = Math.floor(cantidadParejas / 3) - 1; 
        totalZonasDeCuatro = 1; 
    } else {
        totalZonasDeTres = Math.floor(cantidadParejas / 3);
        totalZonasDeCuatro = 0;
    }

    return { totalZonasDeTres, totalZonasDeCuatro };
}
function capturarDatosTorneo(event) {
    event.preventDefault();

    const nombre = document.getElementById('categoria').value;
    const fecha = document.getElementById('fecha-torneo').value;
    const cantidadParejas = parseInt(document.getElementById('parejas').value,10);
    const tiempoPartido = parseInt(document.getElementById('prom-partidos').value);
    const desdeHora = document.getElementById('desde-hora-torneo').value;
    const hastaHora = document.getElementById('hasta-hora-torneo').value;

     
     if (cantidadParejas < 2 || cantidadParejas > 32 || isNaN(cantidadParejas)) {
        alert('La cantidad de parejas debe estar entre 2 y 32.');
        return null;
    }
    
  

    if (tiempoPartido < 10 || tiempoPartido > 120 || isNaN(tiempoPartido)) {
        alert('El tiempo de partido debe estar entre 10 y 120 minutos.');
        return null;
    }

   
    if (!desdeHora || !hastaHora || desdeHora >= hastaHora) {
        alert('La hora de inicio debe ser menor que la hora de finalización.');
        return null;
    }
    
    const { totalZonasDeTres, totalZonasDeCuatro } = verificarZonas(cantidadParejas);
    

    zonaDeTres = totalZonasDeTres
    zonaDeCuatro = totalZonasDeCuatro
    console.log(`Zonas de 3: ${zonaDeTres}, Zonas de 4: ${zonaDeCuatro}`);

    let [horaInicio, minutoInicio] = desdeHora.split(':').map(Number);
    let [horaFin, minutoFin] = hastaHora.split(':').map(Number);
    
    let inicioEnMinutos = horaInicio * 60 + minutoInicio;
    let finEnMinutos = horaFin * 60 + minutoFin;
    let duracionMinutos = finEnMinutos - inicioEnMinutos;

    
    if (duracionMinutos < 300) {
        alert('El torneo debe tener una duración mínima de 5 horas.');
        return null;
    }
    
    fomularioTorneoData.innerHTML = "";
    return { nombre, fecha, cantidadParejas, tiempoPartido, desdeHora, hastaHora };
}

function mostrarJugadoresCargados(){

    grillaJugadores.innerHTML += `<button id="btonCrearZonas">Crear Zonas </button>`
    let btonCrearZona = document.getElementById('btonCrearZonas')
    
    btonCrearZona.addEventListener('click',function(event){
        
        let zonas = agruparZona(parejas);
        console.log("Zonas: ",zonas);
        let cruces = agruparZona(generarCruces(zonas))
        console.log("Cruces Zona",cruces);
        mostrarCruces(cruces);
        
    })
    
}

function mostrarCruces(cruces) {
        const contenedorZonas = document.getElementById('lasZonas');
        contenedorZonas.innerHTML = ''; 
    
       
        for (let zona in cruces) {
            
            const divZona = document.createElement('div');
            divZona.classList.add('zona');
    
            
            const tituloZona = document.createElement('h4');
            tituloZona.classList.add('num-zona');
            tituloZona.innerText = `Zona ${zona}`;
            divZona.appendChild(tituloZona);
    
            
            cruces[zona].forEach(partido => {
               
                const divDatosZona = document.createElement('div');
                divDatosZona.classList.add('datos-zona');
    
               
                const pCruce = document.createElement('p');
                pCruce.classList.add('cruce');
                pCruce.innerText = partido.partido;
                divDatosZona.appendChild(pCruce);
    
               
                const pHorario = document.createElement('p');
                pHorario.classList.add('horario');
                pHorario.innerText = partido.horario;
                divDatosZona.appendChild(pHorario);
    
               
                divZona.appendChild(divDatosZona);
            });
    
           
            contenedorZonas.appendChild(divZona);
        }
}



function crearOpcionesHora(torneoData, cantidadParejasPorZona) {
        const { desdeHora, hastaHora, tiempoPartido } = torneoData;
        let [horaDesde, minutoDesde] = desdeHora.split(':').map(Number);
        let horaActual = horaDesde * 60 + minutoDesde;
    
        let [horaHasta, minutoHasta] = hastaHora.split(':').map(Number);
        let hastaHoraMinutos = horaHasta * 60 + minutoHasta;
    
       
        const tiempoZona = tiempoPartido * (cantidadParejasPorZona === 3 ? 3 : 4);
    
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
    

function crearFormularioJugadores(horarios) {
    formularioParejas.innerHTML = `
         <h2>Ingresa las parejas</h2>
         <input type="text" id="jugador1" name="jugador1" placeholder="Nombre jugador 1" required>
         <input type="text" id="jugador2" name="jugador2" placeholder="Nombre jugador 2" required>
         <select id="horaSelect" placeholder="Elige un horario">
         
         </select>
         <button type="submit" id="submit-pareja-data">Cargar pareja</button>
    `;
   
    
    selectHorarios = document.getElementById('horaSelect');
    btonFormularioPareja = document.getElementById('submit-pareja-data');

       
    const defaultOption = document.createElement("option");
    defaultOption.text = "Seleccione horario";
    defaultOption.value = "";
    defaultOption.disabled = true; 
    defaultOption.selected = true;  
    selectHorarios.add(defaultOption);



   
    horarios.forEach((hora)=>{
        const opcionHora = document.createElement("option");
        opcionHora.text = hora.rango;  
        opcionHora.value = hora.rango; 
        selectHorarios.add(opcionHora); 
    });
    grillaJugadores.innerHTML = `
    <p>Lista de Jugadores</p>
         <div class="header renglon-lista">
                <p class="idJug">ID</p>
                <p>Jugadores</p>
                
            </div>
`
    
    btonFormularioPareja.addEventListener('click', function(event) {
        event.preventDefault();
        ingresarJugadores(torneoData, horarios);
        console.log(parejas);
    
    });
}

function ingresarJugadores(torneoData, horarios) {
    
    
    
        let jugador1 = document.getElementById('jugador1').value;
        let jugador2 = document.getElementById('jugador2').value;
        
       
       
        let horaSeleccionada  = selectHorarios.value;
        if (horaSeleccionada === "") {
            alert('Por favor, selecciona un horario válido.');
            return; 
        }


        let selectedIndex = selectHorarios.selectedIndex


        let pareja = {
            jugador1: jugador1,
            jugador2: jugador2,
            zona: selectedIndex,
            rangoHorario:horaSeleccionada,
        };
        parejas.push(pareja);
        grillaJugadores.innerHTML+= `
             <div class="header renglon-lista">
                    <p class="idJug">${parejasIngresadas}</p>
                    <p>${pareja.jugador1}-${pareja.jugador2}</p>
                    
                </div>
        `





        parejasIngresadas++;
        cantidadDeParejasQuedan = torneoData.cantidadParejas - parejasIngresadas;

        contadorZonas[horaSeleccionada] = (contadorZonas[horaSeleccionada] || 0) + 1;
        if(zonaDeCuatro > 0){
            if (contadorZonas[horaSeleccionada] > 3) {
                selectHorarios.options[selectedIndex].disabled = true;
                zonaDeCuatro = zonaDeCuatro - 1
            }
        } else if(contadorZonas[horaSeleccionada] === 3) {
                console.log(`La hora ${horaSeleccionada} ya fue seleccionada 3 veces y no se puede seleccionar más.`);
                selectHorarios.options[selectedIndex].disabled = true;
            }
        
        

    console.log(`${parejasIngresadas}/${torneoData.cantidadParejas}`)
    if (parejasIngresadas >= torneoData.cantidadParejas) {
        formularioParejas.innerHTML = ``;
        mostrarJugadoresCargados();
        return;
    } else {
        // Limpiar los campos para ingresar nueva pareja
        document.getElementById('jugador1').value = '';  
        document.getElementById('jugador2').value = ''; 
        selectHorarios.selectedIndex = 0;  
    }
}

function verificarZonaDeCuatro(cantidadParejas) {
    let zonasDeTres = Math.floor(cantidadParejas / 3);
    let parejasRestantes = cantidadParejas % 3;

    // Solo se necesita una zona de 4 si hay una pareja sobrante y no se pueden formar más zonas de 3.
    if (parejasRestantes === 1 && zonasDeTres > 0) {
        console.log("Se necesita una zona de 4 parejas.");
        return true; // Se necesita zona de 4
    } else {
        console.log("No se necesita zona de 4 parejas.");
        return false; // No se necesita zona de 4
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

function generarCruces(zonas) {
    let cruces = [];

    for (let zona in zonas) {
        let parejas = zonas[zona];

       
        let rangoHorario = parejas[0].rangoHorario;
        let [horaInicio, horaFin] = rangoHorario.replace('de ', '').split(' a ').map(hora => {
            let [h, m] = hora.split(':').map(Number);
            return h * 60 + m; 
        });

        let tiempoPartido = torneoData.tiempoPartido; 
        let horarioActual = horaInicio;

        for (let i = 0; i < parejas.length; i++) {
            for (let j = i + 1; j < parejas.length; j++) {
                
                if (horarioActual + tiempoPartido <= horaFin) {
                    
                    let partido = {
                        partido: `${parejas[i].jugador1} - ${parejas[i].jugador2} VS ${parejas[j].jugador1} - ${parejas[j].jugador2}`,
                        zona: zona
                    };

                    
                    let horasInicio = Math.floor(horarioActual / 60);
                    let minutosInicio = horarioActual % 60;
                   

                    partido.horario = `de ${horasInicio < 10 ? '0' + horasInicio : horasInicio}:${minutosInicio < 10 ? '0' + minutosInicio : minutosInicio}`;

                    
                    cruces.push(partido);

                    
                    horarioActual += tiempoPartido; 
                } 
            }
        }
    }

    return cruces;
}

