document.addEventListener("DOMContentLoaded", () => {
  // --- FUNCIONES GENERALES ---
  const mostrarSeccion = (id) => {
    document.querySelectorAll(".seccion").forEach((s) => s.classList.remove("activa"));
    document.getElementById(id)?.classList.add("activa");
  };

  const mostrarAlerta = (tipo) => {
    const seccionEliminar = document.getElementById("eliminarTarjeta");
    const titulo = document.getElementById("tituloAlerta");
    const texto = document.getElementById("textoAlerta");
    if (!seccionEliminar || !titulo || !texto) return;

    if (tipo === "tarjeta") {
      titulo.textContent = "Eliminar Tarjeta";
      texto.innerHTML = `¿Estás seguro de que deseas eliminar esta tarjeta?<br><strong>Esta acción no se puede deshacer.</strong>`;
    } else if (tipo === "tarea") {
      titulo.textContent = "Eliminar Tarea";
      texto.innerHTML = `¿Deseas eliminar esta tarea?<br><strong>La tarea se eliminará de la tabla.</strong>`;
    }

    mostrarSeccion("eliminarTarjeta");
  };

  // Variable global para recordar la sección antes de mostrar la alerta
  let seccionAntesDeEliminar = null;

  // Función mejorada para mostrar alerta y guardar la sección actual
  function mostrarAlertaConSeccion(tipo) {
    const activa = document.querySelector(".seccion.activa");
    seccionAntesDeEliminar = activa ? activa.id : null;
    mostrarAlerta(tipo);
  }

  // --- NAVEGACIÓN LATERAL ---
  document.querySelectorAll(".sidebar a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      mostrarSeccion(link.dataset.section);
    });
  });
  mostrarSeccion("inicio");

  // --- TABLEROS: BOTONES DE AÑADIR TARJETA ---
  const botonesAddCard = document.querySelectorAll(".add-card");
  const formularioTarjeta = document.getElementById("formulario-tarjeta");
  const tituloFormularioTarjeta = document.getElementById("titulo-form-tarjeta");
  const formTarjeta = document.getElementById("form-tarjeta");
  const btnCancelarTarjeta = formularioTarjeta.querySelector(".cancelar");

  let columnaDestino = null; // guardará dónde insertar la nueva tarjeta

  botonesAddCard.forEach((boton) => {
    boton.addEventListener("click", () => {
      columnaDestino = boton.closest(".columna").querySelector(".tarjetas");

      const seccion = boton.dataset.seccion;
      let titulo = "Pendiente";
      if (seccion === "proceso") titulo = "En proceso";
      else if (seccion === "completado") titulo = "Completado";

      tituloFormularioTarjeta.textContent = `Añadir Tarjeta - ${titulo}`;
      mostrarSeccion("formulario-tarjeta");
    });
  });

  // --- CANCELAR FORMULARIO TARJETA ---
  btnCancelarTarjeta.addEventListener("click", () => {
    mostrarSeccion("tableros");
  });

  // --- CREAR TARJETA ---
  formTarjeta.addEventListener("submit", (e) => {
    e.preventDefault();

    const titulo = formTarjeta.querySelector('input[type="text"]').value.trim();
    const descripcion = formTarjeta.querySelector("textarea").value.trim();
    const asignado = formTarjeta.querySelectorAll("select")[0].value;
    const prioridad = formTarjeta.querySelectorAll("select")[1].value;
    const fecha = formTarjeta.querySelector('input[type="date"]').value;

    if (!titulo) return alert("Por favor, escribe un título para la tarea.");

    if (!columnaDestino) {
      columnaDestino = document.querySelector(".columna:first-child .tarjetas");
    }

    columnaDestino.insertAdjacentHTML("beforeend", `
      <div class="tarjeta">
        <h4>${titulo}</h4>
        <p>${descripcion}</p>
        <p><img src="/assets/img/icono-calendario.png" class="icono"> ${fecha}</p>
        <p><img src="/assets/img/icono-usuario.png" class="icono"> ${asignado}</p>
        <p><img src="/assets/img/icono-prioridad.png" class="icono"> ${prioridad}</p>
        <div class="botones-tarjeta">
          <button class="eliminar"><img src="/assets/img/basura.png" class="delete-card" alt="Eliminar"></button>
          <div class="botones-derecha">
            <button class="mover-izq"><</button>
            <button class="mover-der">></button>
          </div>
        </div>
      </div>
    `);

    formTarjeta.reset();
    mostrarSeccion("tableros");
  });

  // --- TABLA DE TAREAS ---
  const btnBasura = document.getElementById("btn-borrar-tareas");
  const tabla = document.querySelector(".tabla-contenedor");

  const actualizarBotonBasura = () => {
    const seleccionadas = document.querySelectorAll(".tabla-tareas .check-cuadro.checked").length;
    btnBasura.style.display = seleccionadas > 0 ? "inline-block" : "none";
  };

  tabla?.addEventListener("click", (e) => {
    const cuadro = e.target.closest(".check-cuadro");
    if (!cuadro) return;
    cuadro.classList.toggle("checked");
    actualizarBotonBasura();
  });

  btnBasura?.addEventListener("click", () => mostrarAlertaConSeccion("tarea"));

  // --- FORMULARIO AÑADIR TAREA ---
  const btnAñadirTarea = document.querySelector(".btn-azul");
  const formularioTarea = document.getElementById("formulario-tarea");
  const formTarea = formularioTarea.querySelector("form");
  const btnCancelarTarea = formularioTarea.querySelector(".cancelar");
  const tablaBody = document.querySelector(".tabla-tareas tbody");

  btnAñadirTarea?.addEventListener("click", () => {
    mostrarSeccion("formulario-tarea");
  });

  btnCancelarTarea?.addEventListener("click", () => {
    mostrarSeccion("tareas");
  });

  formTarea?.addEventListener("submit", (e) => {
    e.preventDefault();
    const titulo = document.getElementById("titulo-tarea").value.trim();
    const descripcion = document.getElementById("descripcion-tarea").value.trim();
    const asignarA = document.getElementById("asignar-a").value.trim();
    const estado = document.getElementById("estado").value;
    const prioridad = document.getElementById("prioridad").value;
    const fecha = document.getElementById("fecha").value;

    if (!titulo || !descripcion || !asignarA || !fecha) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const nuevaFila = document.createElement("tr");
    nuevaFila.innerHTML = `
      <td><div class="check-cuadro"></div></td>
      <td>${titulo}</td>
      <td>${prioridad}</td>
      <td>${estado.charAt(0).toUpperCase() + estado.slice(1)}</td>
      <td>${fecha}</td>
      <td>${asignarA}</td>
    `;

    tablaBody.appendChild(nuevaFila);
    formTarea.reset();
    mostrarSeccion("tareas");
  });

  // --- ALERTAS ELIMINAR ---
  const cancelarEliminar = document.getElementById("cancelarEliminar");
  const confirmarEliminar = document.getElementById("confirmarEliminar");

  cancelarEliminar?.addEventListener("click", () => {
    const pendiente = document.querySelector(".pendiente-eliminar");
    if (pendiente) pendiente.classList.remove("pendiente-eliminar");

    if (seccionAntesDeEliminar) {
      mostrarSeccion(seccionAntesDeEliminar);
    } else {
      mostrarSeccion("tareas");
    }
    seccionAntesDeEliminar = null;
  });

  confirmarEliminar?.addEventListener("click", () => {
    const tarjetaEliminar = document.querySelector(".pendiente-eliminar");
    if (tarjetaEliminar) {
      tarjetaEliminar.remove();
    } else {
      document.querySelectorAll(".tabla-tareas .check-cuadro.checked")
        .forEach((c) => c.closest("tr").remove());
    }

    if (seccionAntesDeEliminar) {
      mostrarSeccion(seccionAntesDeEliminar);
    } else {
      mostrarSeccion("tareas");
    }
    seccionAntesDeEliminar = null;
    actualizarBotonBasura();
  });

  // --- CERRAR SESIÓN ---
  const iconCerrar = document.querySelector(".user-info a img");
  const cancelarCerrar = document.getElementById("cancelarCerrarSesion");
  const confirmarCerrar = document.getElementById("confirmarCerrarSesion");

  let ultimaSeccionActiva = null;

  iconCerrar?.addEventListener("click", (e) => {
    e.preventDefault();
    const seccionActiva = document.querySelector(".seccion.activa");
    ultimaSeccionActiva = seccionActiva ? seccionActiva.id : "inicio";
    mostrarSeccion("cerrarSesion");
  });

  cancelarCerrar?.addEventListener("click", () => {
    if (ultimaSeccionActiva) {
      mostrarSeccion(ultimaSeccionActiva);
    } else {
      mostrarSeccion("inicio");
    }
  });

  confirmarCerrar?.addEventListener("click", () => {
    window.location.href = "/index.html";
  });

  // --- ACCIONES EN TARJETAS (eliminar / mover) ---
  const contenedorTableros = document.querySelector("#tableros");

  contenedorTableros?.addEventListener("click", (e) => {
    const btnEliminar = e.target.closest(".eliminar");
    const btnMoverIzq = e.target.closest(".mover-izq");
    const btnMoverDer = e.target.closest(".mover-der");

    if (btnEliminar) {
      const tarjeta = btnEliminar.closest(".tarjeta");
      if (tarjeta) {
        tarjeta.classList.add("pendiente-eliminar");
        mostrarAlertaConSeccion("tarjeta");
      }
      return;
    }

    if (btnMoverIzq) {
      const tarjeta = btnMoverIzq.closest(".tarjeta");
      const columna = tarjeta.closest(".columna");
      const anterior = columna.previousElementSibling?.querySelector(".tarjetas");
      if (anterior) anterior.appendChild(tarjeta);
      return;
    }

    if (btnMoverDer) {
      const tarjeta = btnMoverDer.closest(".tarjeta");
      const columna = tarjeta.closest(".columna");
      const siguiente = columna.nextElementSibling?.querySelector(".tarjetas");
      if (siguiente) siguiente.appendChild(tarjeta);
      return;
    }
  });
  //VARIABLES DE ALERTA GLOBAL

  const alerta = document.getElementById("eliminarTarjeta");
  const tituloAlerta = document.getElementById("tituloAlerta");
  const textoAlerta = document.getElementById("textoAlerta");
  const iconoAlerta = document.getElementById("iconoAlerta");
  const btnCancelar = document.getElementById("cancelarEliminar");
  const btnConfirmar = document.getElementById("confirmarEliminar");

  let seccionRegreso = "reportes"; // a donde se regresa después de éxito

  //MOSTRAR ALERTA DE EXPORTAR PDF

  function mostrarAlertaExportarPDF() {
    mostrarSeccion("eliminarTarjeta");

    tituloAlerta.textContent = "Exportar PDF";
    textoAlerta.innerHTML = `Por favor confirme la acción de exportar PDF.`;
    iconoAlerta.src = "/assets/img/alerta.png";

    // mostrar botones correctos
    btnCancelar.style.display = "inline-block";
    btnConfirmar.textContent = "Confirmar";

    // Quitar cualquier onclick previo del botón Confirmar
    btnConfirmar.onclick = () => {
      mostrarAlertaExitoPDF();
    };
  }

  //MOSTRAR ALERTA DE ÉXITO DESPUÉS DE EXPORTAR

  function mostrarAlertaExitoPDF() {
    mostrarSeccion("eliminarTarjeta");

    tituloAlerta.textContent = "Exportar PDF";
    textoAlerta.textContent = "Reporte exportado a PDF correctamente";
    iconoAlerta.src = "/assets/img/exito.png";

    // Solo mostrar botón Aceptar
    btnCancelar.style.display = "none";
    btnConfirmar.textContent = "Aceptar";

    btnConfirmar.onclick = () => {
      mostrarSeccion("reportes");
    };
  }

  //BOTÓN EXPORTAR PDF (PUNTO DE ENTRADA)

  const btnExportarPDF = document.getElementById("btn-exportar-pdf");
  btnExportarPDF?.addEventListener("click", () => {
    mostrarAlertaExportarPDF();
  });

  //CANCELAR (CIERRA ALERTA)

  btnCancelar.addEventListener("click", () => {
    mostrarSeccion("tabla-tareas");
  });

  // === TABLA DE USUARIOS – DELEGACIÓN DE EVENTOS ===

  const tablaUsuarios = document.querySelector(".tabla-usuarios");

  // ÚNICO EVENTO QUE DEBE EXISTIR
  tablaUsuarios?.addEventListener("click", (e) => {
      const fila = e.target.closest("tr");
      if (!fila) return;

      const datos = fila.querySelectorAll("td");
      if (datos.length < 3) return;

      // Insertar datos en detalle
      document.getElementById("detNombre").textContent = datos[0].textContent;
      document.getElementById("detCorreo").textContent = datos[1].textContent;
      document.getElementById("detTareas").textContent = datos[2].textContent;

      // Guardar nombre original para edición
      document.getElementById("detNombre").dataset.original = datos[0].textContent;

      mostrarSeccion("detalleUsuario");
  });

  //     EDITAR USUARIO

  document.getElementById("btnEditarUsuario").addEventListener("click", () => {

      // Pasar valores al formulario
      document.getElementById("editNombre").value = document.getElementById("detNombre").textContent;
      document.getElementById("editCorreo").value = document.getElementById("detCorreo").textContent;
      document.getElementById("editTareas").value = document.getElementById("detTareas").textContent;

      // Mostrar edición
      document.getElementById("detalleUsuario").style.display = "none";
      document.getElementById("editarUsuario").style.display = "block";
  });

  //     ACEPTAR EDICIÓN

  // Reemplaza tu handler actual por este
document.getElementById("btnAceptarEditar").addEventListener("click", () => {
  // Ocultar el formulario de edición (si estaba visible)
  const editarUsuarioSec = document.getElementById("editarUsuario");
  if (editarUsuarioSec) editarUsuarioSec.style.display = "none";

  // Asegurarnos que los botones de alerta son tipo button (evita submit)
  if (btnCancelar) btnCancelar.type = "button";
  if (btnConfirmar) btnConfirmar.type = "button";

  // Mostrar confirmación usando tu sección de alertas
  mostrarSeccion("eliminarTarjeta");
  tituloAlerta.textContent = "Confirmar cambios";
  textoAlerta.innerHTML = "¿Deseas guardar los cambios realizados?";
  iconoAlerta.src = "/assets/img/alerta.png";

  // Mostrar ambos botones correctamente
  btnCancelar.style.display = "inline-block";
  btnConfirmar.style.display = "inline-block";
  btnConfirmar.textContent = "Confirmar";

  // CANCELAR -> volver al formulario de edición (oculta la alerta)
  btnCancelar.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // quitar clase activa de la alerta para ocultarla
    const alertaSec = document.getElementById("eliminarTarjeta");
    if (alertaSec) alertaSec.classList.remove("activa");
    // mostrar sección editarUsuario
    mostrarSeccion("editarUsuario");
  };

  // CONFIRMAR -> aplicar cambios y mostrar alerta de éxito
  btnConfirmar.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Tomar valores del formulario de edición
    const nuevoNombre = document.getElementById("editNombre").value;
    const nuevoCorreo = document.getElementById("editCorreo").value;
    const nuevasTareas = document.getElementById("editTareas").value;
    const nombreOriginal = document.getElementById("detNombre").dataset.original;

    // Actualizar fila en la tabla
    const filas = document.querySelectorAll(".tabla-usuarios tr");
    filas.forEach(fila => {
      const celdas = fila.querySelectorAll("td");
      if (celdas.length && celdas[0].textContent === nombreOriginal) {
        celdas[0].textContent = nuevoNombre;
        celdas[1].textContent = nuevoCorreo;
        celdas[2].textContent = nuevasTareas;
      }
    });

    // Mostrar alerta de éxito (reutilizando la misma sección)
    mostrarSeccion("eliminarTarjeta");
    tituloAlerta.textContent = "Cambios guardados";
    textoAlerta.textContent = "Los cambios fueron aplicados correctamente.";
    iconoAlerta.src = "/assets/img/exito.png";

    // Solo botón Aceptar visible
    btnCancelar.style.display = "none";
    btnConfirmar.style.display = "inline-block";
    btnConfirmar.textContent = "Aceptar";

    // Al Aceptar, cerrar alerta y mostrar tabla de usuarios
    btnConfirmar.onclick = (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      // quitar clase activa de la alerta
      const alertaSec = document.getElementById("eliminarTarjeta");
      if (alertaSec) alertaSec.classList.remove("activa");
      // mostrar tabla usuarios
      mostrarSeccion("usuarios");
    };
  };
});



  //     CANCELAR EDICIÓN

  document.getElementById("btnCancelarEditar").addEventListener("click", () => {
      document.getElementById("editarUsuario").style.display = "none";
      document.getElementById("detalleUsuario").style.display = "block";
  });

  //     VOLVER DESDE DETALLE

  document.getElementById("btnVolverUsuario").addEventListener("click", () => {
      mostrarSeccion("usuarios");
  });




  


});

