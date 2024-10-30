document.addEventListener("DOMContentLoaded", function () {
	let torneosGuardados = localStorage.getItem("torneoGuardado");
	torneosGuardados = JSON.parse(torneosGuardados) || [];
	

	mostrarTorneos(torneosGuardados);

	function mostrarTorneos(torneosGuardados) {
		let listaTorneos = document.getElementById("listado-torneos");
		listaTorneos.innerHTML = `<h1>Listado de Torneos</h1>`;
		if (torneosGuardados.length === 0) {
			listaTorneos.innerHTML += `<p class="sin-torneos">No hay torneos disponibles en este momento.</p>`;
			return;
		}

		torneosGuardados.forEach((torneo, index) => {
			const esteTorneo = torneo.torneoData;
			listaTorneos.innerHTML += `
				<div class="tournament-card">
					<h2>${esteTorneo.nombre}</h2>
					<p><strong>Fecha: </strong> ${esteTorneo.fecha}</p>
					<p><strong>Hora: </strong>${esteTorneo.desdeHora}</p>
					<p><strong>Categoría: </strong>${esteTorneo.categoria}</p>
					
					<button id="${index}" class="btn ver-partidos">Ver Partidos</button>
					<button id="${index}" class="borrar-torneo btn">Borrar torneo</button>
				</div>
			`;
		});

		document.querySelectorAll(".ver-partidos").forEach((boton) => {
			boton.addEventListener("click", function () {
				const idTorneo = this.id;
				
				const torneoSeleccionado = torneosGuardados[idTorneo];
				mostrarPartidos(torneoSeleccionado.cruces);
			});
		});

		document.querySelectorAll(".borrar-torneo").forEach((boton) => {
			boton.addEventListener("click", function () {
				const idTorneo = this.id;
				
				torneosGuardados.splice(idTorneo, 1);

				for (let i = 0; i < torneosGuardados.length; i++) {
					torneosGuardados[i].index = i;
				}

				localStorage.setItem(
					"torneoGuardado",
					JSON.stringify(torneosGuardados)
				);
				mostrarTorneos(torneosGuardados);
				document.getElementById("lasZonas").innerHTML = "";
			});
		});
	}

	function mostrarPartidos(cruces) {
		const contenedorCruces = document.getElementById("lasZonas");
		contenedorCruces.innerHTML = "";
		for (let zona in cruces) {
			const divZona = document.createElement("div");
			divZona.classList.add("zona");
			divZona.innerHTML = `<h4>Zona ${zona}</h4>`;
			cruces[zona].forEach((partido) => {
				divZona.innerHTML += `
					<div class="partido">
						<p>${partido.partido}</p>
						<p>${partido.horario}</p>
					</div>
				`;
			});
			contenedorCruces.appendChild(divZona);
		}
	}
});
