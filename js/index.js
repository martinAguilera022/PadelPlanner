window.addEventListener('DOMContentLoaded', () => {
    const datTorneo = document.getElementById('crear-torneo');
    const contFechas = document.getElementById('fechas-juego');
    
    let fechasDisponibles = [];

    // Captura datos del torneo al hacer submit
    datTorneo.addEventListener('submit', function (event) {
        event.preventDefault();
        capturarDatosTorneo();
    });

    // Captura datos de los jugadores
    const datosPareja = document.getElementById("ingresa-jugador");
    cargarJugadores(datosPareja);
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
                <p class="tit-fecha">Fecha ${i}</p>
                <input type="date" name="fecha-${i}" placeholder="Fecha" required>
                <label>Desde:</label>
                <input type="time" name="desd-hora-${i}" required>
                <label>Hasta:</label>
                <input type="time" name="hast-hora-${i}" required>
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
        console.log(listFechas);
        crearSelectFechas(listFechas);
    });
}

// Función para crear selectores de fechas para los jugadores
function crearSelectFechas(listFechas) {
    const selects = document.querySelectorAll('select[name^="fecha-"]');

    selects.forEach(select => {
        select.innerHTML = ''; // Limpiar las opciones previas
        listFechas.forEach(fecha => {
            const option = document.createElement('option');
            option.value = fecha.fecha;
            option.text = `${fecha.fecha}`;
            select.appendChild(option);
        });

        select.addEventListener('change', function () {
            actualizarHora(select, listFechas);
        });
    });
}

// Función para actualizar las horas basadas en la fecha seleccionada
function actualizarHora(select, listFechas) {
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
function cargarJugadores(datosPareja) {
    let i = 1;
    datosPareja.addEventListener('submit', function (event) {
        event.preventDefault();
        
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
        console.log(pareja);
        listaJugadores(pareja,i);
    });


}
function listaJugadores(pareja,i){
    const grillaJug = document.getElementById("grilla-jugadores");
    
    
    

    grillaJug.innerHTML +=(`
         <div class="renglon-lista">
                    <p class ="idJug">${i}</p>
                    <p>${pareja.nombre1} - ${pareja.nombre2}</p>
                    <p>${pareja.fechaDisp1.fecha1}</p>
                    <p>${pareja.fechaDisp2.fecha2}</p>
                    
                </div>     
        `);

}
