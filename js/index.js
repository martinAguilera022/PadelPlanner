window.addEventListener('DOMContentLoaded', () => {
    const datTorneo = document.getElementById('crear-torneo');
    const contFechas = document.getElementById('fechas-juego');
    
    let fechasDisponibles = [];

    // Captura datos del torneo al hacer submit
    datTorneo.addEventListener('submit', function (event) {
        event.preventDefault();
        capturarDatosTorneo();
        datTorneo.innerHTML = '';
    });

    // Captura datos de los jugadores
    
});

// Función para capturar datos del torneo
function capturarDatosTorneo() {
    const categoria = document.querySelector('input[name="categoria"]').value;
    console.log(categoria);

    const numCanchas = document.querySelector('input[name="canchas"]').value;
    console.log(numCanchas);

    const cantParejas = document.querySelector('input[name="parejas"]').value;
    console.log(cantParejas);

    const cantFechas = document.querySelector('input[name="fechas"]').value;
    console.log(cantFechas);

    const tiempoPartido = document.querySelector('input[name="prom-partido"]').value;
    console.log(tiempoPartido);

    ingresarFechas(cantFechas);
}

// Función para ingresar fechas del torneo
function ingresarFechas(cantFechas) {
    console.log(`Cantidad de fechas: ${cantFechas}`);
    const contenedorFechas = document.getElementById('fechas-juego');
    contenedorFechas.innerHTML += `<h3>Ingrese las fechas</h3>`;
    
    for (let i = 1; i <= cantFechas; i++) {
        contenedorFechas.innerHTML += `
            <form id="fecha-form-${i}">
                <p class="tit-fecha">Ingresa cuando inicia el torneo</p>
                <input type="date" name="fecha-${i}" placeholder="Fecha" required>
                <label for ="desd-hora${i}" >Desde:</label>
                <input id="desd-hora${i}" type="time" name="desd-hora-${i}" required>
                <label for ="hasta-hora${i}">Hasta:</label>
                <input id="hasta-hora${i}" type="time" name="hast-hora-${i}" required>
            </form>`;
    }
    contenedorFechas.innerHTML += `<button type="submit" id="cargar-fechas-btn">Cargar Fechas</button>`;

    document.getElementById('cargar-fechas-btn').addEventListener('click', function (event) {
        event.preventDefault();
        let listFechas = [];
        for (let i = 1; i <= cantFechas; i++) {
            let fechaSeleccionada = document.querySelector(`input[name="fecha-${i}"]`).value;
            let desdeHora = document.querySelector(`input[name="desd-hora-${i}"]`).value;
            let hastaHora = document.querySelector(`input[name="hast-hora-${i}"]`).value;

            let nuevaFecha = { fecha: fechaSeleccionada, desde: desdeHora, hasta: hastaHora };
            listFechas.push(nuevaFecha);
        }
        const datosPareja = document.getElementById("ingresa-jugador");
        cargarJugadores(datosPareja,cantFechas);
        console.log(listFechas);
        ingresaParejas(listFechas,cantFechas);
        contenedorFechas.innerHTML = '';
    });
}

// Función para crear selectores de fechas para los jugadores
function ingresaParejas(listFechas,cantFechas) {
  
    const mostrarFechas = document.getElementById('ingresa-jugador');

    if(cantFechas == 1){
        const fechaSeleccionada  = listFechas[0];
        
        mostrarFechas.innerHTML =`
           
                <p class="subtitulo">Torneo el dia ${cambiarFecha(fechaSeleccionada.fecha)}</p>
                    
                <div>
                    <div class="cargar-jugador">
           <div class="nom-jugadores">
               <p>Nombre de Jugadores</p>
               <input type="text" name="nombre1" placeholder="Nombre y apellido del Jugador 1" required>
               <input type="text" name="nombre2" placeholder="Nombre y apellido del Jugador 2" required>
           </div>
           <div class="horarios"> 
                <p class="subtitulo">Ingrese entre que horarios puede jugar</p>
                <label for="hora-inicio">De: </label>
                <input id="hora-inicio" type="time" name="hora_inicio1" required>
                <label for="hora_fin">Hasta: </label>
                <input id="hora-fin" type="time" name="hora_fin1" required>
            </div>
        
                <button type="submit">Cargar parejas</button>
            
        `
    }else{
        mostrarFechas.innerHTML =`
         <div>
                        <p>Fecha 1</p>
                        <label for="fecha-1"></label>
                        <select name="fecha-1" id="fecha-1" required>
                           
                        </select>
                        <p class="subtitulo">Ingrese entre que horarios puede jugar</p>
                        <label for="hora-inicio">De: </label>
                        <input id="hora-inicio" type="time" name="hora_inicio1" required>
                        <label for="hora_fin">Hasta: </label>
                        <input id="hora-fin" type="time" name="hora_fin1" required>
                    </div>
        
                    <div>
                        <p>Fecha 2</p>
                        <label for="fecha-2"></label>
                        <select name="fecha-2" id="fecha-2" required>
                            <!-- Aquí se agregarán las opciones de fechas dinámicamente -->
                        </select>
                        <p class="subtitulo">Ingrese entre que horarios puede jugar</p>
                        <label for="hora-inicio2">De: </label>
                        <input id="hora-inicio2" type="time" name="hora_inicio2" required>
                        <label for="hora_fin2">Hasta: </label>
                        <input id="hora_fin2" type="time" name="hora_fin2" required>
                    </div>
      `;
        const selects = document.querySelectorAll('select[name^="fecha-"]');
        selects.forEach(select => {
            select.innerHTML = ''; 
            listFechas.forEach(fecha => {
                const option = document.createElement('option');
                option.value = fecha.fecha;
                option.text = `${fecha.fecha}`;
                select.appendChild(option);
            });
    
            select.addEventListener('change', function () {
                limitarHoraHora(select, listFechas);
            });
        });
    }


    
}

function cambiarFecha(fecha){
    
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(fecha).toLocaleDateString('es-ES', opciones);
    }



function limitarHora(select, listFechas) {
    const fechaSeleccionada = select.value;
    const fechaObj = listFechas.find(f => f.fecha === fechaSeleccionada);

    if (fechaObj) {
        const form = select.closest('form');
        if (form) {
            const inputHoraInicio = form.querySelector('input[name^="hora_inicio"]');
            const inputHoraFin = form.querySelector('input[name^="hora_fin"]');

            if (inputHoraInicio && inputHoraFin) {
                inputHoraInicio.min = fechaObj.desde;
                inputHoraInicio.max = fechaObj.hasta;
                inputHoraFin.min = fechaObj.desde;
                inputHoraFin.max = fechaObj.hasta;
                inputHoraInicio.value = '';
                inputHoraFin.value = '';
            } else {
                console.error('No se encontraron los campos de hora en el formulario.');
            }
        } else {
            console.error('No se encontró el formulario asociado al select.');
        }
    } else {
        console.error('No se encontró una fecha que coincida.');
    }
}

// Función para cargar datos de jugadores
function cargarJugadores(datosPareja,cantFechas) {
    let i = 1;
    datosPareja.addEventListener('submit', function (event) {
        event.preventDefault();
        
        if(cantFechas==1){
            let nombre1 = document.querySelector('input[name="nombre1"]').value;
            let nombre2 = document.querySelector('input[name="nombre2"]').value;
            let horaDesde1 = document.querySelector('input[name="hora_inicio1"]').value;
            let horaHasta1 = document.querySelector('input[name ="hora_fin1"]').value;
            pareja = {nombre1,nombre2,horaDesde1,horaHasta1}


            
        }else{

            let fecha1 = document.querySelector('select[name="fecha-1"]').value;
            let fecha2 = document.querySelector('select[name="fecha-2"]').value;
            let nombre1 = document.querySelector('input[name="nombre1"]').value;
            let nombre2 = document.querySelector('input[name="nombre2"]').value;
            let horaDesde1 = document.querySelector('input[name="hora_inicio1"]').value;
            let horaHasta1 = document.querySelector('input[name ="hora_fin1"]').value;
            let horaDesde2 = document.querySelector('input[name="hora_inicio2"]').value;
            let horaHasta2 = document.querySelector('input[name ="hora_fin2"]').value;
            
            console.log(`Fecha 1: ${fecha1}`);
            console.log(`Fecha 2: ${fecha2}`);
            i++;
            let fechaDisp1 = {fecha1,horaDesde1,horaHasta1}
            let fechaDisp2 = {fecha2,horaDesde2,horaHasta2}
            pareja = {nombre1,nombre2,fechaDisp1,fechaDisp2}
        }

        
        console.log(pareja);
        listaJugadores(pareja,i,cantFechas);
    });


}
function listaJugadores(pareja,i,cantFechas){
    const grillaJug = document.getElementById("grilla-jugadores");
    
    if(cantFechas==1){
        grillaJug.innerHTML +=(`
            <div class="renglon-lista">
                       <p class ="idJug">${i}</p>
                       <p>${pareja.nombre1} - ${pareja.nombre2}</p>
                       
                       
                   </div>     
           `);
    }
    else{

        grillaJug.innerHTML +=(`
            <div class="renglon-lista">
                        <p class ="idJug">${i}</p>
                        <p>${pareja.nombre1} - ${pareja.nombre2}</p>
                       
                        
                    </div>     
            `);
    }
}
