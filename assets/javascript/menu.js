document.addEventListener("DOMContentLoaded", () => {
  // Ocultar la casita y el botón admin inmediatamente al cargar
  setTimeout(() => {
    const linkCasita = document.querySelector('.sidebar a[data-section="inicio"]');
    const botonAdmin = document.querySelector('.sidebar a[data-section="admin"]');
    if (linkCasita) {
      linkCasita.style.display = "none";
    }
    if (botonAdmin) {
      botonAdmin.style.display = "none";
    }
  }, 10);

  // --- VARIABLES GLOBALES MEJORADAS ---
  let seccionAntesDeEliminar = null;
  let ultimaSeccionActiva = null;
  let filaEditando = null;

  // --- FUNCIONES GENERALES ---
  const mostrarSeccion = (id) => {
    // Primero ocultar TODAS las secciones
    document.querySelectorAll(".seccion").forEach((s) => {
      s.classList.remove("activa");
      // NO aplicar display: none a las alertas
      if (!s.id.includes("eliminarTarjeta") && !s.id.includes("cerrarSesion")) {
        s.style.display = "none";
      }
    });
    
    // Luego mostrar solo la sección activa
    const seccion = document.getElementById(id);
    if (seccion) {
      seccion.classList.add("activa");
      // NO forzar display block para las alertas - mantener su CSS original
      if (!seccion.id.includes("eliminarTarjeta") && !seccion.id.includes("cerrarSesion") && seccion.id !== "inicio") {
        seccion.style.display = "block";
      } else if (seccion.id === "inicio") {
        seccion.style.display = "flex";
      }
    }
    
    // LÓGICA PARA LA CASITA
    const linkCasita = document.querySelector('.sidebar a[data-section="inicio"]');
    if (linkCasita) {
      if (id === "inicio") {
        linkCasita.style.display = "none";
      } else {
        linkCasita.style.display = "flex";
      }
    }
    
    // Mostrar el botón admin SOLO cuando se clickee "usuarios"
    const botonAdmin = document.querySelector('.sidebar a[data-section="admin"]');
    if (botonAdmin) {
      if (id === "usuarios") {
        botonAdmin.style.display = "flex";
      } else {
        botonAdmin.style.display = "none";
      }
    }
  };

  // --- SISTEMA UNIFICADO DE ALERTAS ---
  function configurarAlerta(titulo, mensaje, tipo = "alerta", config) {
    const tituloAlerta = document.getElementById("tituloAlerta");
    const textoAlerta = document.getElementById("textoAlerta");
    const iconoAlerta = document.getElementById("iconoAlerta");
    const btnCancelar = document.getElementById("cancelarEliminar");
    const btnConfirmar = document.getElementById("confirmarEliminar");

    if (!tituloAlerta || !textoAlerta || !iconoAlerta || !btnCancelar || !btnConfirmar) return;

    // Configurar contenido básico
    tituloAlerta.textContent = titulo;
    textoAlerta.innerHTML = mensaje;
    iconoAlerta.src = tipo === "exito" ? "/assets/img/exito.png" : "/assets/img/alerta.png";

    // Configurar botones según el tipo de alerta
    if (config?.soloAceptar) {
      btnCancelar.style.display = "none";
      btnConfirmar.textContent = "Aceptar";
    } else {
      btnCancelar.style.display = "inline-block";
      btnConfirmar.textContent = config?.textoConfirmar || "Confirmar";
    }

    // Limpiar event listeners previos
    btnCancelar.replaceWith(btnCancelar.cloneNode(true));
    btnConfirmar.replaceWith(btnConfirmar.cloneNode(true));

    // Obtener nuevas referencias después del clone
    const nuevoBtnCancelar = document.getElementById("cancelarEliminar");
    const nuevoBtnConfirmar = document.getElementById("confirmarEliminar");

    // Configurar acciones
    if (config?.onCancelar) {
      nuevoBtnCancelar.addEventListener("click", config.onCancelar);
    } else {
      nuevoBtnCancelar.addEventListener("click", () => {
        if (seccionAntesDeEliminar) {
          mostrarSeccion(seccionAntesDeEliminar);
        } else {
          mostrarSeccion("admin");
        }
      });
    }

    if (config?.onConfirmar) {
      nuevoBtnConfirmar.addEventListener("click", config.onConfirmar);
    }

    // Mostrar la alerta
    mostrarSeccion("eliminarTarjeta");
  }

  // --- ALERTAS ESPECÍFICAS ---
  function mostrarAlertaEliminarTarjeta(tarjeta) {
    seccionAntesDeEliminar = document.querySelector(".seccion.activa")?.id || "tableros";
    
    configurarAlerta(
      "Eliminar Tarjeta",
      "¿Estás seguro de que deseas eliminar esta tarjeta?<br><strong>Esta acción no se puede deshacer.</strong>",
      "alerta",
      {
        textoConfirmar: "Eliminar",
        onConfirmar: () => {
          tarjeta.remove();
          mostrarAlertaExito("Tarjeta eliminada correctamente", "tableros");
        }
      }
    );
  }

  function mostrarAlertaEliminarTareas() {
    seccionAntesDeEliminar = "tareas";
    
    configurarAlerta(
      "Eliminar Tareas",
      "¿Estás seguro de que deseas eliminar las tareas seleccionadas?<br><strong>Esta acción no se puede deshacer.</strong>",
      "alerta",
      {
        textoConfirmar: "Eliminar",
        onConfirmar: () => {
          document.querySelectorAll(".tabla-tareas .check-cuadro.checked")
            .forEach((c) => c.closest("tr").remove());
          actualizarBotonBasura();
          mostrarAlertaExito("Tareas eliminadas correctamente", "tareas");
        }
      }
    );
  }

  function mostrarAlertaExito(mensaje, seccionRegreso = "admin") {
    configurarAlerta(
      "Éxito",
      mensaje,
      "exito",
      {
        soloAceptar: true,
        onConfirmar: () => {
          mostrarSeccion(seccionRegreso);
        }
      }
    );
  }

  // --- FUNCIONALIDAD PARA EXPORTAR PDF EN REPORTES ---
  function inicializarExportarPDF() {
    const btnExportarPDF = document.getElementById("btn-exportar-pdf");
    
    btnExportarPDF?.addEventListener("click", function() {
      mostrarAlertaExportarPDF();
    });
  }

  function mostrarAlertaExportarPDF() {
    // GUARDAR LA SECCIÓN ACTUAL ANTES DE MOSTRAR LA ALERTA
    const activa = document.querySelector(".seccion.activa");
    seccionAntesDeEliminar = activa ? activa.id : null;
    
    configurarAlerta(
      "Exportar PDF",
      "¿Estás seguro de que deseas exportar el reporte a PDF?",
      "alerta",
      {
        textoConfirmar: "Exportar",
        onConfirmar: () => {
          // Aquí va la lógica para exportar a PDF
          exportarAPDF();
          mostrarAlertaExitoPDF();
        },
        onCancelar: () => {
          if (seccionAntesDeEliminar) {
            mostrarSeccion(seccionAntesDeEliminar);
          } else {
            mostrarSeccion("reportes");
          }
        }
      }
    );
  }

  function exportarAPDF() {
    // Esta es una función simulada - necesitarías una librería como jsPDF
    console.log("Exportando a PDF...");
    // Ejemplo con jsPDF:
    /*
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Reporte de Tareas", 20, 20);
    doc.save("reporte.pdf");
    */
    
    // Por ahora mostramos un alert
    alert("Funcionalidad de exportar PDF - Aquí se implementaría con una librería como jsPDF");
  }

  function mostrarAlertaExitoPDF() {
    configurarAlerta(
      "Exportar PDF",
      "Reporte exportado a PDF correctamente",
      "exito",
      {
        soloAceptar: true,
        onConfirmar: () => {
          if (seccionAntesDeEliminar) {
            mostrarSeccion(seccionAntesDeEliminar);
          } else {
            mostrarSeccion("reportes");
          }
        }
      }
    );
  }

  // --- NAVEGACIÓN LATERAL ---
  document.querySelectorAll(".sidebar a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      mostrarSeccion(link.dataset.section);
    });
  });

  // Mostrar INICIO por defecto
  mostrarSeccion("inicio");

  // --- TABLEROS: BOTONES DE AÑADIR TARJETA ---
  const botonesAddCard = document.querySelectorAll(".add-card");
  const formularioTarjeta = document.getElementById("formulario-tarjeta");
  const tituloFormularioTarjeta = document.getElementById("titulo-form-tarjeta");
  const formTarjeta = document.getElementById("form-tarjeta");
  const btnCancelarTarjeta = formularioTarjeta?.querySelector(".cancelar");

  let columnaDestino = null;

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
  btnCancelarTarjeta?.addEventListener("click", () => {
    mostrarSeccion("tableros");
  });

  // --- CREAR TARJETA ---
  formTarjeta?.addEventListener("submit", (e) => {
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
    if (btnBasura) {
      btnBasura.style.display = seleccionadas > 0 ? "inline-block" : "none";
    }
  };

  tabla?.addEventListener("click", (e) => {
    const cuadro = e.target.closest(".check-cuadro");
    if (!cuadro) return;
    cuadro.classList.toggle("checked");
    actualizarBotonBasura();
  });

  btnBasura?.addEventListener("click", () => {
    mostrarAlertaEliminarTareas();
  });

  // --- FORMULARIO AÑADIR TAREA ---
  const btnAñadirTarea = document.querySelector(".btn-azul");
  const formularioTarea = document.getElementById("formulario-tarea");
  const formTarea = formularioTarea?.querySelector("form");
  const btnCancelarTarea = formularioTarea?.querySelector(".cancelar");
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

  // --- CERRAR SESIÓN ---
  const iconCerrar = document.querySelector(".user-info a img");
  const cancelarCerrar = document.getElementById("cancelarCerrarSesion");
  const confirmarCerrar = document.getElementById("confirmarCerrarSesion");

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
        mostrarAlertaEliminarTarjeta(tarjeta);
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

  // === SECCION ADMIN - USUARIOS (COMPLETA Y CORREGIDA) ===
  const filasAgregar = document.querySelectorAll('.fila-agregar[data-action="añadir-usuario"]');
  const formUsuarioAdmin = document.getElementById('form-usuario-admin');
  const tablaAdmin = document.querySelector('.tabla-admin tbody');

  // === CORRECCIÓN PARA EDITAR USUARIO AL HACER CLIC EN LA FILA ===
  function inicializarTablaUsuarios() {
    const tablaUsuarios = document.querySelector(".tabla-usuarios");
    
    if (!tablaUsuarios) return;
    
    // Event delegation para toda la tabla de usuarios
    tablaUsuarios.addEventListener('click', function(e) {
      const fila = e.target.closest('tr');
      if (!fila) return;
      
      // Si es la fila de agregar, no hacer nada (ya tiene su propio evento)
      if (fila.classList.contains('fila-agregar')) return;
      
      // Si se hizo clic en un botón de acción, dejar que ese evento se maneje
      if (e.target.closest('.btn-editar-admin') || e.target.closest('.btn-eliminar-admin')) {
        return;
      }
      
      // Si se hizo clic en cualquier otra parte de la fila, editar el usuario
      manejarEditarUsuarioDesdeFila(fila);
    });
  }

  function manejarEditarUsuarioDesdeFila(fila) {
    const celdas = fila.querySelectorAll('td');
    if (celdas.length < 4) return;
    
    const nombre = celdas[0].textContent;
    const correo = celdas[1].textContent;
    const tareasTexto = celdas[2].textContent;
    const notas = celdas[3].textContent;
    
    // Guardar referencia a la fila que se está editando
    filaEditando = fila;
    
    // Llenar el formulario de edición
    document.getElementById('edit-nombre-completo').value = nombre;
    document.getElementById('edit-correo-electronico').value = correo;
    document.getElementById('edit-notas').value = notas;
    
    // Limpiar y cargar tareas en el select
    const selectTareas = document.getElementById('select-tareas');
    if (selectTareas) {
      selectTareas.innerHTML = '';
      
      if (tareasTexto && tareasTexto !== 'Añadir' && tareasTexto !== 'Sin tareas') {
        const tareasArray = tareasTexto.split(', ').filter(t => t.trim());
        if (tareasArray.length > 0) {
          tareasArray.forEach(tarea => {
            agregarTareaAlSelect(tarea.trim());
          });
        } else {
          agregarTareaAlSelect(tareasTexto);
        }
      }
    }
    
    // Mostrar la sección de edición
    mostrarSeccion('editar-usuario-admin');
  }

  // Event delegation para toda la tabla admin (botones editar/eliminar)
  tablaAdmin?.addEventListener('click', function(e) {
    const btnEditar = e.target.closest('.btn-editar-admin');
    const btnEliminar = e.target.closest('.btn-eliminar-admin');
    
    if (btnEditar) {
      e.preventDefault();
      e.stopPropagation();
      const fila = btnEditar.closest('tr');
      manejarEditarUsuarioDesdeFila(fila);
    }
    
    if (btnEliminar) {
      e.preventDefault();
      e.stopPropagation();
      const fila = btnEliminar.closest('tr');
      mostrarAlertaEliminarUsuarioAdmin(fila);
    }
  });

  filasAgregar.forEach(fila => {
    fila.addEventListener('click', function(e) {
      if (!e.target.closest('.btn-editar-admin') && !e.target.closest('.btn-eliminar-admin')) {
        mostrarSeccion('formulario-admin');
      }
    });
  });

  if (formUsuarioAdmin) {
    const btnCancelarAdmin = formUsuarioAdmin.querySelector('.cancelar');
    if (btnCancelarAdmin) {
      btnCancelarAdmin.addEventListener('click', function() {
        mostrarSeccion('admin');
      });
    }

    formUsuarioAdmin.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const inputs = this.querySelectorAll('input');
      const nombre = inputs[0].value.trim();
      const correo = inputs[1].value.trim();
      const tareas = inputs[2].value.trim();
      const notas = this.querySelector('textarea').value.trim();
      
      if (!nombre || !correo || !tareas || !notas) {
        alert('Por favor completa todos los campos.');
        return;
      }
      
      seccionAntesDeEliminar = "formulario-admin";
      configurarAlerta(
        "Añadir Usuario",
        `¿Estás seguro de que deseas añadir a <strong>${nombre}</strong>?`,
        "alerta",
        {
          textoConfirmar: "Añadir",
          onConfirmar: () => {
            añadirUsuarioATabla(nombre, correo, tareas, notas);
            formUsuarioAdmin.reset();
            mostrarAlertaExito("Usuario añadido correctamente", "admin");
          },
          onCancelar: () => {
            mostrarSeccion("formulario-admin");
          }
        }
      );
    });
  }

  function añadirUsuarioATabla(nombre, correo, tareas, notas) {
    const nuevaFila = document.createElement('tr');
    nuevaFila.innerHTML = `
      <td>${nombre}</td>
      <td>${correo}</td>
      <td>${tareas}</td>
      <td>${notas}</td>
      <td class="acciones-celda">
        <button class="btn-editar-admin">
          <img src="/assets/img/editar.png" alt="Editar">
        </button>
        <button class="btn-eliminar-admin">
          <img src="/assets/img/eliminar.png" alt="Eliminar">
        </button>
      </td>
    `;
    
    const filaAgregar = document.querySelector('.fila-agregar');
    if (filaAgregar) {
      tablaAdmin.insertBefore(nuevaFila, filaAgregar);
    } else {
      tablaAdmin.appendChild(nuevaFila);
    }
  }

  function mostrarAlertaEliminarUsuarioAdmin(fila) {
    const nombreUsuario = fila.querySelector('td').textContent;
    seccionAntesDeEliminar = "admin";
    
    configurarAlerta(
      "Eliminar Usuario",
      `¿Eliminar a <strong>${nombreUsuario}</strong>?<br>Esta acción no se puede deshacer.`,
      "alerta",
      {
        textoConfirmar: "Eliminar",
        onConfirmar: () => {
          fila.remove();
          mostrarAlertaExito("Usuario eliminado correctamente", "admin");
        }
      }
    );
  }

  // === SISTEMA DE TAREAS PARA EDITAR USUARIO ===
  function inicializarSistemaTareas() {
    const btnAgregar = document.getElementById('btn-añadir-tarea');
    const inputTarea = document.getElementById('nueva-tarea-input');
    const selectTareas = document.getElementById('select-tareas');
    
    if (!btnAgregar || !inputTarea || !selectTareas) return;

    btnAgregar.addEventListener('click', function() {
      agregarTareaAlSelect();
    });
    
    inputTarea.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        agregarTareaAlSelect();
      }
    });
    
    selectTareas.addEventListener('keydown', function(e) {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectTareas.selectedIndex !== -1) {
        e.preventDefault();
        selectTareas.options[selectTareas.selectedIndex].remove();
        actualizarTamañoSelect();
      }
    });
  }

  function agregarTareaAlSelect(textoTarea = null) {
    const inputTarea = document.getElementById('nueva-tarea-input');
    const selectTareas = document.getElementById('select-tareas');
    
    const texto = textoTarea || inputTarea.value.trim();
    
    if (texto !== '') {
      const nuevaOpcion = document.createElement('option');
      nuevaOpcion.value = texto;
      nuevaOpcion.textContent = texto;
      selectTareas.appendChild(nuevaOpcion);
      
      if (!textoTarea) {
        inputTarea.value = '';
      }
      
      actualizarTamañoSelect();
      
      if (!textoTarea) {
        inputTarea.focus();
      }
    }
  }

  function actualizarTamañoSelect() {
    const selectTareas = document.getElementById('select-tareas');
    if (!selectTareas) return;
    
    const cantidadTareas = selectTareas.options.length;
    selectTareas.size = Math.min(Math.max(3, cantidadTareas), 6);
  }

  function obtenerTextoDeTareas() {
    const selectTareas = document.getElementById('select-tareas');
    if (!selectTareas) return 'Sin tareas';
    
    const tareas = [];
    for (let option of selectTareas.options) {
      tareas.push(option.value);
    }
    
    return tareas.length > 0 ? tareas.join(', ') : 'Sin tareas';
  }

  // === FORMULARIO EDITAR USUARIO ===
  const formEditarUsuario = document.getElementById('form-editar-usuario-admin');
  if (formEditarUsuario) {
    inicializarSistemaTareas();
    
    const btnCancelarEditar = formEditarUsuario.querySelector('.cancelar');
    if (btnCancelarEditar) {
      btnCancelarEditar.addEventListener('click', function() {
        mostrarSeccion('admin');
      });
    }

    formEditarUsuario.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const nombre = document.getElementById('edit-nombre-completo').value.trim();
      const correo = document.getElementById('edit-correo-electronico').value.trim();
      const notas = document.getElementById('edit-notas').value.trim();
      const tareasTexto = obtenerTextoDeTareas();
      
      if (!nombre || !correo || !notas) {
        alert('Completa todos los campos.');
        return;
      }
      
      if (filaEditando) {
        const celdas = filaEditando.querySelectorAll('td');
        celdas[0].textContent = nombre;
        celdas[1].textContent = correo;
        celdas[2].textContent = tareasTexto;
        celdas[3].textContent = notas;
      }
      
      mostrarAlertaExito("Los cambios se guardaron correctamente", "admin");
    });
  }

  // === INICIALIZACIÓN FINAL ===
  function inicializarTodo() {
    inicializarSistemaTareas();
    inicializarTablaUsuarios();
    inicializarExportarPDF();
  }

  // Inicializar cuando se carga la página
  inicializarTodo();
});