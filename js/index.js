let parejas = [];
let torneoData;
let horarios = [];
let parejasIngresadas = 0;
let contadorZonas = {};
let selectHorarios;
let btonFormularioPareja;
let zonaDeCuatro;
let zonaDeTres;
let index;
let losTorneos = [];
losTorneosLS = JSON.parse(localStorage.getItem("torneoGuardado"));

if (losTorneosLS) {
	losTorneos = losTorneosLS;
	index = losTorneos.length;
} else {
	losTorneos = [];
	index = 0;
}

formularioTorneoData = document.getElementById("crear-torneo");
botonTorneoData = document.getElementById("submit-torneo-data");
formularioParejas = document.getElementById("ingresa-jugador");
grillaJugadores = document.getElementById("grilla-jugadores");

botonTorneoData.addEventListener("click", function (event) {
	const tiempoPartido = document.getElementById("prom-partidos");
	const desdeHora = document.getElementById("desde-hora-torneo");
	const hastaHora = document.getElementById("hasta-hora-torneo");
	let alertaError = document.getElementById("alerta-torneo");
	alertaError.innerHTML = "";
	const nuevaAlerta = document.createElement("p");
	nuevaAlerta.classList.add("alerta");

	torneoData = capturarDatosTorneo(event);
	
	horarios = crearOpcionesHora(torneoData);
	
	if (horarios.length < zonaDeTres + zonaDeCuatro) {
		nuevaAlerta.textContent =
			"El rango horario no es suficiente para los partidos";
		alertaError.appendChild(nuevaAlerta);

		tiempoPartido.value = "";
		desdeHora.value = "";
		hastaHora.value = "";
		return null;
	} else {
		formularioTorneoData.innerHTML = "";
		
		crearFormularioJugadores(horarios);
	}
});

const inputs = document.querySelectorAll(".input-container");

inputs.forEach((input) => {
	input.addEventListener("input", () => {
		if (input.value) {
			input.style.color = "#FFF";
		} else {
			input.style.color = "grey";
		}
	});

	if (input.value) {
		input.style.color = "#FFF";
	} else {
		input.style.color = "grey";
	}
});

function verificarZonas(cantidadParejas) {
	if (cantidadParejas % 3 === 0) {
		totalZonasDeTres = cantidadParejas / 3;
		totalZonasDeCuatro = 0;
	} else if (cantidadParejas % 3 === 1) {
		totalZonasDeTres = Math.floor(cantidadParejas / 3) - 1;
		totalZonasDeCuatro = 1;
	} else {
		totalZonasDeTres = Math.floor(cantidadParejas / 3) - 2;
		totalZonasDeCuatro = 2;
	}

	return { totalZonasDeTres, totalZonasDeCuatro };
}

function capturarDatosTorneo(event) {
	event.preventDefault();
	const nombre = document.getElementById("nombre-torneo").value;
	const categoria = document.getElementById("categoria").value;
	const fecha = document.getElementById("fecha-torneo").value;
	const cantidadParejas = parseInt(
		document.getElementById("parejas").value,
		10
	);
	const tiempoPartido = parseInt(
		document.getElementById("prom-partidos").value
	);
	const desdeHora = document.getElementById("desde-hora-torneo").value;
	const hastaHora = document.getElementById("hasta-hora-torneo").value;
	let alertaError = document.getElementById("alerta-torneo");
	alertaError.innerHTML = "";

	const nuevaAlerta = document.createElement("p");
	nuevaAlerta.classList.add("alerta");

	if (
		nombre === "" ||
		categoria === "" ||
		fecha === "" ||
		isNaN(cantidadParejas) ||
		cantidadParejas <= 0 ||
		isNaN(tiempoPartido) ||
		tiempoPartido <= 0 ||
		desdeHora === "" ||
		hastaHora === ""
	) {
		nuevaAlerta.textContent = "Porfavor complete todos lo campos.";
		alertaError.appendChild(nuevaAlerta);
		return null;
	}

	if (cantidadParejas < 2 || cantidadParejas > 32 || isNaN(cantidadParejas)) {
		nuevaAlerta.textContent = "La cantidad de parejas debe estar entre 2 y 32.";
		alertaError.appendChild(nuevaAlerta);
		return null;
	}

	if (tiempoPartido < 10 || tiempoPartido > 120 || isNaN(tiempoPartido)) {
		nuevaAlerta.textContent =
			"El tiempo de partido debe estar entre 10 y 120 minutos.";
		alertaError.appendChild(nuevaAlerta);

		return null;
	}

	if (!desdeHora || !hastaHora || desdeHora >= hastaHora) {
		nuevaAlerta.textContent =
			"La hora de inicio debe ser menor que la hora de finalización.";
		alertaError.appendChild(nuevaAlerta);

		return null;
	}

	const { totalZonasDeTres, totalZonasDeCuatro } =
		verificarZonas(cantidadParejas);

	zonaDeTres = totalZonasDeTres;
	zonaDeCuatro = totalZonasDeCuatro;
	

	let [horaInicio, minutoInicio] = desdeHora.split(":").map(Number);
	let [horaFin, minutoFin] = hastaHora.split(":").map(Number);

	let inicioEnMinutos = horaInicio * 60 + minutoInicio;
	let finEnMinutos = horaFin * 60 + minutoFin;
	let duracionMinutos = finEnMinutos - inicioEnMinutos;

	if (duracionMinutos < 300) {
		nuevaAlerta.textContent =
			"El torneo debe tener una duración mínima de 5 horas.";
		alertaError.appendChild(nuevaAlerta);

		return null;
	}

	return {
		nombre,
		categoria,
		fecha,
		cantidadParejas,
		tiempoPartido,
		desdeHora,
		hastaHora,
	};
}

function mostrarJugadoresCargados() {
	grillaJugadores.innerHTML += `<button id="btonCrearZonas">Crear Zonas </button>`;
	let btonCrearZona = document.getElementById("btonCrearZonas");

	btonCrearZona.addEventListener("click", function (event) {
		let zonas = agruparZona(parejas);
		
		let cruces = agruparZona(generarCruces(zonas));
		
		grillaJugadores.innerHTML = "";
		mostrarCruces(cruces);
		const contenedorZonas = document.getElementById("lasZonas");
		const crearGuardarTorneo = document.createElement("button");
		crearGuardarTorneo.id = "guardarTorneo";
		crearGuardarTorneo.innerText = "Guardar Torneo";
		contenedorZonas.appendChild(crearGuardarTorneo);

		btonGuardarTorneo = document.getElementById("guardarTorneo");

		btonGuardarTorneo.addEventListener("click", function (event) {
			let esteTorneo = { index, torneoData, cruces };
			

			losTorneos.push(esteTorneo);

			localStorage.setItem("torneoGuardado", JSON.stringify(losTorneos));

			crearTextoTorneoGuardado = document.createElement("p");

			crearTextoTorneoGuardado.innerText = "Torneo Guardado Exitosamente!.";
			crearGuardarTorneo.removeAttribute("id");

			crearGuardarTorneo.innerText = "Ver Torneos";
			crearGuardarTorneo.id = "verTorneos";
			crearTextoTorneoGuardado.classList.add("texto-exitoso");
			contenedorZonas.appendChild(crearTextoTorneoGuardado);
			contenedorZonas.appendChild(crearGuardarTorneo);

			crearGuardarTorneo.addEventListener("click", function () {
				window.location.href = "./pages/misTorneos.html";
			});
		});
	});
}

function mostrarCruces(cruces) {
	const contenedorZonas = document.getElementById("lasZonas");
	contenedorZonas.innerHTML = "";

	for (let zona in cruces) {
		const divZona = document.createElement("div");
		divZona.classList.add("zona");

		const tituloZona = document.createElement("h4");
		tituloZona.classList.add("num-zona");
		tituloZona.innerText = `Zona ${zona}`;
		divZona.appendChild(tituloZona);

		cruces[zona].forEach((partido) => {
			const divDatosZona = document.createElement("div");
			divDatosZona.classList.add("datos-zona");

			const pCruce = document.createElement("p");
			pCruce.classList.add("cruce");
			pCruce.innerText = partido.partido;
			divDatosZona.appendChild(pCruce);

			const pHorario = document.createElement("p");
			pHorario.classList.add("horario");
			pHorario.innerText = partido.horario;
			divDatosZona.appendChild(pHorario);

			divZona.appendChild(divDatosZona);
		});

		contenedorZonas.appendChild(divZona);
	}
}

function crearOpcionesHora(torneoData, cantidadParejasPorZona) {
	const { desdeHora, hastaHora, tiempoPartido } = torneoData;
	let [horaDesde, minutoDesde] = desdeHora.split(":").map(Number);
	let horaActual = horaDesde * 60 + minutoDesde;

	let [horaHasta, minutoHasta] = hastaHora.split(":").map(Number);
	let hastaHoraMinutos = horaHasta * 60 + minutoHasta;
	console.log(torneoData);

	const tiempoZona = tiempoPartido * (cantidadParejasPorZona === 3 ? 3 : 4);

	let opciones = [];

	while (horaActual + tiempoZona <= hastaHoraMinutos) {
		let horaInicio = Math.floor(horaActual / 60);
		let minutosInicio = horaActual % 60;
		let horaFormateadaInicio = `${horaInicio}:${
			minutosInicio < 10 ? "0" + minutosInicio : minutosInicio
		}`;

		horaActual += tiempoZona;
		let horaFin = Math.floor(horaActual / 60);
		let minutosFin = horaActual % 60;
		let horaFormateadaFin = `${horaFin}:${
			minutosFin < 10 ? "0" + minutosFin : minutosFin
		}`;

		opciones.push({
			rango: `de ${horaFormateadaInicio} a ${horaFormateadaFin}`,
		});
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
         <div id="alerta-pareja">
         
         </div>
         <button type="submit" id="submit-pareja-data">Cargar pareja</button>
    `;

	selectHorarios = document.getElementById("horaSelect");
	btonFormularioPareja = document.getElementById("submit-pareja-data");

	const defaultOption = document.createElement("option");
	defaultOption.text = "Seleccione horario";
	defaultOption.value = "";
	defaultOption.disabled = true;
	defaultOption.selected = true;
	selectHorarios.add(defaultOption);

	totalZonas = zonaDeTres + zonaDeCuatro;
	
	for (i = 0; i < totalZonas; i++) {
		hora = horarios[i];
		const opcionHora = document.createElement("option");
		opcionHora.text = hora.rango;
		opcionHora.value = hora.rango;
		selectHorarios.add(opcionHora);
	}
	grillaJugadores.innerHTML = `
    <p>Lista de Jugadores</p>
         <div class="header renglon-lista">
                <p class="idJug">ID</p>
                <p>Jugadores</p>
                
            </div>
`;

	btonFormularioPareja.addEventListener("click", function (event) {
		event.preventDefault();
		ingresarJugadores(torneoData, horarios);
		console.log(parejas);
	});
}

function ingresarJugadores(torneoData, horarios) {
	let jugador1 = document.getElementById("jugador1").value;
	let jugador2 = document.getElementById("jugador2").value;
	let alertaError = document.getElementById("alerta-pareja");
	alertaError.innerHTML = "";

	const nuevaAlerta = document.createElement("p");
	nuevaAlerta.classList.add("alerta");
	if (jugador1 == "" || jugador2 === "") {
		nuevaAlerta.textContent = "Complete los campos de jugador";
		alertaError.appendChild(nuevaAlerta);
		return;
	}

	let horaSeleccionada = selectHorarios.value;
	if (horaSeleccionada === "") {
		nuevaAlerta.textContent = "Por favor, selecciona un horario válido.";
		alertaError.appendChild(nuevaAlerta);
		return;
	}

	let selectedIndex = selectHorarios.selectedIndex;

	let pareja = {
		jugador1: jugador1,
		jugador2: jugador2,
		zona: selectedIndex,
		rangoHorario: horaSeleccionada,
	};
	parejas.push(pareja);
	grillaJugadores.innerHTML += `
             <div class="header renglon-lista">
                    <p class="idJug">${parejasIngresadas}</p>
                    <p>${pareja.jugador1}-${pareja.jugador2}</p>
                    
                </div>
        `;
	parejasIngresadas++;
	cantidadDeParejasQuedan = torneoData.cantidadParejas - parejasIngresadas;

	contadorZonas[horaSeleccionada] = (contadorZonas[horaSeleccionada] || 0) + 1;
	if (zonaDeCuatro > 0) {
		if (contadorZonas[horaSeleccionada] > 3) {
			selectHorarios.options[selectedIndex].disabled = true;
			zonaDeCuatro = zonaDeCuatro - 1;
		}
	} else if (contadorZonas[horaSeleccionada] === 3) {
		
		selectHorarios.options[selectedIndex].disabled = true;
	}

	
	if (parejasIngresadas >= torneoData.cantidadParejas) {
		formularioParejas.innerHTML = ``;
		mostrarJugadoresCargados();
		return;
	} else {
		document.getElementById("jugador1").value = "";
		document.getElementById("jugador2").value = "";
		selectHorarios.selectedIndex = 0;
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
		let [horaInicio, horaFin] = rangoHorario
			.replace("de ", "")
			.split(" a ")
			.map((hora) => {
				let [h, m] = hora.split(":").map(Number);
				return h * 60 + m;
			});

		let tiempoPartido = torneoData.tiempoPartido;
		let horarioActual = horaInicio;

		for (let i = 0; i < parejas.length; i++) {
			for (let j = i + 1; j < parejas.length; j++) {
				if (horarioActual + tiempoPartido <= horaFin) {
					let partido = {
						partido: `${parejas[i].jugador1} - ${parejas[i].jugador2} VS ${parejas[j].jugador1} - ${parejas[j].jugador2}`,
						zona: zona,
					};

					let horasInicio = Math.floor(horarioActual / 60);
					let minutosInicio = horarioActual % 60;

					partido.horario = `de ${
						horasInicio < 10 ? "0" + horasInicio : horasInicio
					}:${minutosInicio < 10 ? "0" + minutosInicio : minutosInicio}`;

					cruces.push(partido);

					horarioActual += tiempoPartido;
				}
			}
		}
	}

	return cruces;
}
