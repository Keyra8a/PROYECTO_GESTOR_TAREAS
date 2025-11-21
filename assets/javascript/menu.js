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

  // --- VARIABLES GLOBALES ---
  let seccionAntesDeEliminar = null;
  let ultimaSeccionActiva = null;
  let filaEditando = null;
  let imagenSeleccionada = null;

  // Hacer mostrarSeccion global para que users.js pueda acceder
  window.mostrarSeccion = (id) => {
    console.log("Mostrando sección:", id);
    
    // 1. Ocultar TODAS las secciones
    document.querySelectorAll(".seccion").forEach((s) => {
        s.classList.remove("activa");
        s.style.display = "none";
    });
    
    // 2. Mostrar solo la sección solicitada
    const seccion = document.getElementById(id);
    if (seccion) {
        seccion.classList.add("activa");
        
        if (id === "inicio") {
            seccion.style.display = "flex";
        } else if (id === "eliminarTarjeta" || id === "cerrarSesion" || id === "alerta-cambiar-foto") {
            seccion.style.display = "flex";
        } else {
            seccion.style.display = "block";
        }
    }

    // LÓGICA PARA LA CASITA
    const linkCasita = document.querySelector('.sidebar a[data-section="inicio"]');
    if (linkCasita) {
        linkCasita.style.display = (id === "inicio") ? "none" : "flex";
    }
    
    // Mostrar el botón admin SOLO cuando se clickee "usuarios"
    const botonAdmin = document.querySelector('.sidebar a[data-section="admin"]');
    if (botonAdmin) {
        botonAdmin.style.display = (id === "usuarios") ? "flex" : "none";
    }
  };

  // Hacer configurarAlerta global para que users.js pueda acceder
  window.configurarAlerta = function(titulo, mensaje, tipo = "alerta", config) {
    const tituloAlerta = document.getElementById("tituloAlerta");
    const textoAlerta = document.getElementById("textoAlerta");
    const iconoAlerta = document.getElementById("iconoAlerta");
    const btnCancelar = document.getElementById("cancelarEliminar");
    const btnConfirmar = document.getElementById("confirmarEliminar");

    if (!tituloAlerta || !textoAlerta || !iconoAlerta || !btnCancelar || !btnConfirmar) return;

    // Configurar contenido básico
    tituloAlerta.textContent = titulo;
    textoAlerta.innerHTML = mensaje;
    iconoAlerta.src = tipo === "exito" ? "../../assets/img/exito.png" : "../../assets/img/alerta.png";

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
          window.mostrarSeccion(seccionAntesDeEliminar);
        } else {
          window.mostrarSeccion("admin");
        }
      });
    }

    if (config?.onConfirmar) {
      nuevoBtnConfirmar.addEventListener("click", config.onConfirmar);
    }

    // Mostrar la alerta
    window.mostrarSeccion("eliminarTarjeta");
  };

  // --- ALERTAS ESPECÍFICAS ---
  function mostrarAlertaEliminarTarjeta(tarjeta) {
    seccionAntesDeEliminar = document.querySelector(".seccion.activa")?.id || "tableros";
    
    window.configurarAlerta(
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
    
    window.configurarAlerta(
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
    window.configurarAlerta(
      "Éxito",
      mensaje,
      "exito",
      {
        soloAceptar: true,
        onConfirmar: () => {
          window.mostrarSeccion(seccionRegreso);
        }
      }
    );
  }

  // --- FUNCIONALIDAD PARA CONFIRMACIÓN DE FOTO ---
  function mostrarConfirmacion(imagenSrc) {
    console.log("🖼️ Mostrando confirmación con imagen:", imagenSrc);
    
    imagenSeleccionada = imagenSrc;
    
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.style.display = 'flex';
        
        const imgModal = modal.querySelector('img');
        if (imgModal) {
            imgModal.src = imagenSrc;
        }
    }
  }

  function ocultarConfirmacion() {
    console.log("Ocultando confirmación");
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.style.display = 'none';
    }
    imagenSeleccionada = null;
    
    window.mostrarSeccion("perfil");
  }

  function confirmarFoto() {
    if (imagenSeleccionada) {
        const fotoPerfil = document.querySelector('.foto-perfil');
        if (fotoPerfil) {
            fotoPerfil.innerHTML = `<img src="${imagenSeleccionada}" alt="Foto de perfil" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        }
        
        console.log('✅ Foto confirmada y actualizada en el perfil');
    }
    
    ocultarConfirmacion();
    window.mostrarSeccion("perfil");
  }

  // --- FUNCIONALIDAD PARA EXPORTAR PDF EN REPORTES ---
  function inicializarExportarPDF() {
    const btnExportarPDF = document.getElementById("btn-exportar-pdf");
    
    btnExportarPDF?.addEventListener("click", function() {
      mostrarAlertaExportarPDF();
    });
  }

  function mostrarAlertaExportarPDF() {
    const activa = document.querySelector(".seccion.activa");
    seccionAntesDeEliminar = activa ? activa.id : null;
    
    window.configurarAlerta(
      "Exportar PDF",
      "¿Estás seguro de que deseas exportar el reporte a PDF?",
      "alerta",
      {
        textoConfirmar: "Exportar",
        onConfirmar: () => {
          exportarAPDF();
          mostrarAlertaExitoPDF();
        },
        onCancelar: () => {
          if (seccionAntesDeEliminar) {
            window.mostrarSeccion(seccionAntesDeEliminar);
          } else {
            window.mostrarSeccion("reportes");
          }
        }
      }
    );
  }

  function exportarAPDF() {
    console.log("Exportando a PDF...");
    // Aquí implementar con jsPDF
  }

  function mostrarAlertaExitoPDF() {
    window.configurarAlerta(
      "Exportar PDF",
      "Reporte exportado a PDF correctamente",
      "exito",
      {
        soloAceptar: true,
        onConfirmar: () => {
          if (seccionAntesDeEliminar) {
            window.mostrarSeccion(seccionAntesDeEliminar);
          } else {
            window.mostrarSeccion("reportes");
          }
        }
      }
    );
  }

  // --- NAVEGACIÓN LATERAL ---
  document.querySelectorAll(".sidebar a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      window.mostrarSeccion(link.dataset.section);
    });
  });

  // Mostrar INICIO por defecto
  window.mostrarSeccion("inicio");

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
      window.mostrarSeccion("formulario-tarjeta");
    });
  });

  btnCancelarTarjeta?.addEventListener("click", () => {
    window.mostrarSeccion("tableros");
  });

  formTarjeta?.addEventListener("submit", (e) => {
    e.preventDefault();

    const titulo = formTarjeta.querySelector('input[type="text"]').value.trim();
    const descripcion = formTarjeta.querySelector("textarea").value.trim();
    const asignado = formTarjeta.querySelectorAll("select")[0].value;
    const prioridad = formTarjeta.querySelectorAll("select")[1].value;
    const fecha = formTarjeta.querySelector('input[type="date"]').value;

    if (!titulo) {
      window.configurarAlerta(
        "Error",
        "Por favor, escribe un título para la tarea.",
        "alerta",
        {
          soloAceptar: true,
          onConfirmar: () => window.mostrarSeccion("formulario-tarjeta")
        }
      );
      return;
    }

    if (!columnaDestino) {
      columnaDestino = document.querySelector(".columna:first-child .tarjetas");
    }

    columnaDestino.insertAdjacentHTML("beforeend", `
      <div class="tarjeta">
        <h4>${titulo}</h4>
        <p><img src="../../assets/img/icono-calendario.png" class="icono"> ${fecha}</p>
        <p><img src="../../assets/img/icono-usuario.png" class="icono"> ${asignado}</p>
        <p><img src="../../assets/img/icono-prioridad.png" class="icono"> ${prioridad}</p>
        <div class="botones-tarjeta">
          <button class="eliminar"><img src="../../assets/img/basura.png" class="delete-card" alt="Eliminar"></button>
          <div class="botones-derecha">
            <button class="mover-izq"><</button>
            <button class="mover-der">></button>
          </div>
        </div>
      </div>
    `);

    formTarjeta.reset();
    window.mostrarSeccion("tableros");
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
    window.mostrarSeccion("formulario-tarea");
  });

  btnCancelarTarea?.addEventListener("click", () => {
    window.mostrarSeccion("tareas");
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
      window.configurarAlerta(
        "Error",
        "Por favor completa todos los campos.",
        "alerta",
        {
          soloAceptar: true,
          onConfirmar: () => window.mostrarSeccion("formulario-tarea")
        }
      );
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
    window.mostrarSeccion("tareas");
  });

  // --- CERRAR SESIÓN ---
  const iconCerrar = document.querySelector(".user-info a img");
  const cancelarCerrar = document.getElementById("cancelarCerrarSesion");
  const confirmarCerrar = document.getElementById("confirmarCerrarSesion");

  iconCerrar?.addEventListener("click", (e) => {
    e.preventDefault();
    const seccionActiva = document.querySelector(".seccion.activa");
    ultimaSeccionActiva = seccionActiva ? seccionActiva.id : "inicio";
    window.mostrarSeccion("cerrarSesion");
  });

  cancelarCerrar?.addEventListener("click", () => {
    if (ultimaSeccionActiva) {
      window.mostrarSeccion(ultimaSeccionActiva);
    } else {
      window.mostrarSeccion("inicio");
    }
  });

  confirmarCerrar?.addEventListener("click", () => {
    window.location.href = "../../index.html";
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

  // === FUNCIONES DESHABILITADAS - AHORA LO MANEJA users.js ===
  
  // window.mostrarDetallesUsuarioDesdeFila = function(fila) {
  //   console.log("Función deshabilitada - users.js maneja los detalles de usuario");
  //   return;
  // };

  // window.editarUsuarioDesdeDetalles = function() {
  //   console.log("Función deshabilitada - users.js maneja la edición");
  //   return;
  // };

  // window.eliminarUsuarioDesdeDetalles = function() {
  //   console.log("Función deshabilitada - users.js maneja la eliminación");
  //   return;
  // };

  // === SECCION ADMIN - USUARIOS ===
  const filasAgregar = document.querySelectorAll('.fila-agregar[data-action="añadir-usuario"]');
  const formUsuarioAdmin = document.getElementById('form-usuario-admin');
  const tablaAdmin = document.querySelector('.tabla-admin tbody');

  function manejarEditarUsuarioDesdeFila(fila) {
    const celdas = fila.querySelectorAll('td');
    if (celdas.length < 4) return;
    
    const nombre = celdas[0].textContent;
    const correo = celdas[1].textContent;
    const tareasTexto = celdas[2].textContent;
    const notas = celdas[3].textContent;
    
    filaEditando = fila;
    
    document.getElementById('edit-nombre-completo').value = nombre;
    document.getElementById('edit-correo-electronico').value = correo;
    document.getElementById('edit-notas').value = notas;
    
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
    
    window.mostrarSeccion('editar-usuario-admin');
  }

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
        window.mostrarSeccion('formulario-admin');
      }
    });
  });

  if (formUsuarioAdmin) {
    const btnCancelarAdmin = formUsuarioAdmin.querySelector('.cancelar');
    if (btnCancelarAdmin) {
      btnCancelarAdmin.addEventListener('click', function() {
        window.mostrarSeccion('admin');
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
        window.configurarAlerta(
          "Error",
          "Por favor completa todos los campos.",
          "alerta",
          {
            soloAceptar: true,
            onConfirmar: () => window.mostrarSeccion("formulario-admin")
          }
        );
        return;
      }
      
      seccionAntesDeEliminar = "formulario-admin";
      window.configurarAlerta(
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
            window.mostrarSeccion("formulario-admin");
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
          <img src="../../assets/img/editar.png" alt="Editar">
        </button>
        <button class="btn-eliminar-admin">
          <img src="../../assets/img/eliminar.png" alt="Eliminar">
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
    
    window.configurarAlerta(
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
    const inputTarea = document.getElementById('nueva-tarea');
    const selectTareas = document.getElementById('select-tareas');

    function agregarTareaAlSelect(texto) {
      if (!texto.trim()) return;
      
      const option = document.createElement('option');
      option.value = texto;
      option.textContent = texto;
      selectTareas.appendChild(option);
    }

    btnAgregar?.addEventListener('click', function() {
      const texto = inputTarea?.value.trim();
      if (texto) {
        agregarTareaAlSelect(texto);
        if (inputTarea) inputTarea.value = '';
      }
    });

    inputTarea?.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        btnAgregar?.click();
      }
    });
  }

  // Inicializar sistema de tareas
  inicializarSistemaTareas();
});