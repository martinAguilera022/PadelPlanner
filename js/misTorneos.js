document.addEventListener("DOMContentLoaded", function () {
	let torneosGuardados = localStorage.getItem("torneoGuardado");
	torneosGuardados = JSON.parse(torneosGuardados) || [];
	contenedorTorneos = document.querySelector(".container");
	if (torneosGuardados.length === 0) {
		fetch("../torneoMuestra.json")
			.then((response) => response.json())
			.then((data) => {
				torneosGuardados = data;
				localStorage.setItem(
					"torneoGuardado",
					JSON.stringify(torneosGuardados)
				);
				mostrarTorneos(torneosGuardados);
			})
			.catch((error) => {
				Toastify({
					text: `Error al cargar el Torneo JSON: ${error.message}`, // Mostrar el mensaje de error
					duration: 3000,
					gravity: "top",
					position: "center",
					stopOnFocus: true,
					backgroundColor: "#0BE2A7",
					style: {
						color: "#ffffff",
						fontSize: "16px",
						fontWeight: "bold",
					},
				}).showToast();
			});
	}
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
					<p><strong>Parejas: </strong>${esteTorneo.cantidadParejas}</p>
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

				Swal.fire({
					title: "Quieres eliminar este torneo?",
					text: "No vas a poder revertir este cambio!",
					icon: "warning",
					showCancelButton: true,
					confirmButtonColor: "#0BE2A7",

					confirmButtonText: "Si, eliminar!",
					background: "#000000",
					iconColor: " #0BE2A7",
					color: "#ffff",
					customClass: {
						cancelButton: "my-confirm-button",
					},
				}).then((result) => {
					if (result.isConfirmed) {
						Swal.fire({
							title: "Torneo Eliminado con Exito",
							text: "",
							icon: "success",
							background: "#000000",
							iconColor: " #0BE2A7",
							color: "#ffff",
							confirmButtonColor: "#0BE2A7",
						});
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
					} else if (result.isDenied) {
						Swal.fire("Torneo no Eliminado!", "", "info");
					}
				});
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
			divZona.innerHTML += `
					<div class="partido">
						<p class ="tit-zonas">Partido</p>
						<p class ="tit-zonas">Comienzo de Partido</p>
						
					</div>
				`;
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
