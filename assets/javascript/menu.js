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
  let usuarioActualDetalles = null;

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
    console.log("Mostrando confirmación con imagen:", imagenSrc);
    
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
        
        console.log('Foto confirmada y actualizada en el perfil');
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

  // === FUNCIÓN PARA DETALLES DE USUARIO (CORREGIDA) ===
  function mostrarDetallesUsuarioDesdeFila(fila) {
    if (!fila) {
        console.log("Error: fila es null");
        return;
    }
    
    const celdas = fila.querySelectorAll('td');
    if (celdas.length < 4) {
        console.log("Error: no hay suficientes celdas", celdas.length);
        return;
    }
    
    const nombre = celdas[0].textContent;
    const correo = celdas[1].textContent;
    const tareas = celdas[2].textContent;
    
    console.log("Cargando detalles para:", nombre);
    
    // Mostrar en la sección de detalles
    const detNombre = document.getElementById('detNombre');
    const detCorreo = document.getElementById('detCorreo');
    const detTareas = document.getElementById('detTareas');
    const detEstado = document.getElementById('detEstado');
    const detFecha = document.getElementById('detFecha');
    
    if (detNombre) detNombre.textContent = nombre;
    if (detCorreo) detCorreo.textContent = correo;
    if (detTareas) detTareas.textContent = `${calcularTareas(tareas)} tareas`;
    if (detEstado) detEstado.textContent = 'Activo';
    if (detFecha) detFecha.textContent = new Date().toLocaleDateString();
    
    // Guardar referencia
    usuarioActualDetalles = { nombre, correo, tareas, fila };
    
    // VERIFICACIÓN POR ID DEL USUARIO (data-id)
    const userId = fila.getAttribute('data-id');
    console.log("ID de usuario:", userId);
    
    // Control de botones - SOLO mostrar para el usuario logueado
    const btnEditar = document.getElementById('btnEditarUsuario');
    const btnEliminar = document.getElementById('btnEliminarUsuario');
    
    // Verificar si es el usuario actual (comparar con CURRENT_USER)
    const currentUser = window.CURRENT_USER;
    const esUsuarioActual = currentUser && String(currentUser.id) === String(userId);
    
    if (btnEditar) {
        btnEditar.style.display = esUsuarioActual ? 'inline-block' : 'none';
        console.log(esUsuarioActual ? "Mostrando botón editar" : "Ocultando botón editar");
    }
    
    // El botón eliminar ya no existe en el HTML, pero verificamos por seguridad
    if (btnEliminar) {
        btnEliminar.style.display = 'none'; 
    }
    
    window.mostrarSeccion('detalleUsuario');
  }

  function calcularTareas(tareasTexto) {
    if (!tareasTexto || tareasTexto === 'Añadir' || tareasTexto === 'Sin tareas') return 0;
    
    const numero = parseInt(tareasTexto);
    if (!isNaN(numero)) return numero;
    
    const tareasArray = tareasTexto.split(', ').filter(t => t.trim());
    return tareasArray.length > 0 ? tareasArray.length : 1;
  }

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
        window.mostrarSeccion('admin');
      });
    }

    formEditarUsuario.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const nombre = document.getElementById('edit-nombre-completo').value.trim();
      const correo = document.getElementById('edit-correo-electronico').value.trim();
      const notas = document.getElementById('edit-notas').value.trim();
      const tareasTexto = obtenerTextoDeTareas();
      
      if (!nombre || !correo || !notas) {
        window.configurarAlerta(
          "Error",
          "Completa todos los campos.",
          "alerta",
          {
            soloAceptar: true,
            onConfirmar: () => window.mostrarSeccion("editar-usuario-admin")
          }
        );
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

  function inicializarPerfil() {
    console.log("🔄 Inicializando perfil...");
    
    // EVENT DELEGATION PARA TODOS LOS BOTONES DEL PERFIL
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        // 1. BOTONES CAMBIAR (nombre, correo, contraseña)
        if (target.classList.contains('btn-cambiar') || target.closest('.btn-cambiar')) {
            e.preventDefault();
            const boton = target.classList.contains('btn-cambiar') ? target : target.closest('.btn-cambiar');
            const campo = boton.getAttribute('data-campo');
            
            console.log("✅ Botón cambiar clickeado:", campo);
            
            document.getElementById('perfil').classList.remove('activa');
            document.getElementById('perfil').style.display = 'none';
            
            const seccionEditar = document.getElementById(`editar-${campo}`);
            if (seccionEditar) {
                document.querySelectorAll('#editar-nombre, #editar-correo, #editar-contrasena').forEach(sec => {
                    sec.classList.remove('activa');
                    sec.style.display = 'none';
                });
                
                seccionEditar.classList.add('activa');
                seccionEditar.style.display = 'block';
                
                if (campo === 'nombre') {
                    const valorActual = boton.closest('.input-y-boton').querySelector('.input-perfil').value;
                    const inputEdicion = seccionEditar.querySelector('.input-edicion');
                    if (inputEdicion) {
                        inputEdicion.value = valorActual;
                    }
                }
            }
        }
        
        // 2. BOTONES CANCELAR EDICIÓN
        if (target.classList.contains('btn-cancelar-edicion') || target.closest('.btn-cancelar-edicion')) {
            e.preventDefault();
            console.log("✅ Botón cancelar clickeado");
            
            document.querySelectorAll('#editar-nombre, #editar-correo, #editar-contrasena').forEach(seccion => {
                seccion.classList.remove('activa');
                seccion.style.display = 'none';
            });
            
            document.getElementById('perfil').classList.add('activa');
            document.getElementById('perfil').style.display = 'block';
        }
    });
    
    // ENVÍO DE FORMULARIOS DE EDICIÓN
    document.querySelectorAll('.form-edicion-perfil').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("✅ Formulario enviado");
            
            const seccionId = this.closest('.seccion').id;
            const campo = seccionId.replace('editar-', '');
            
            if (campo === 'correo') {
                const nuevoCorreo = document.getElementById('nuevo-correo')?.value;
                const confirmarCorreo = document.getElementById('confirmar-correo')?.value;
                
                if (!nuevoCorreo || !confirmarCorreo) {
                    window.configurarAlerta(
                      "Error",
                      "Por favor completa ambos campos de correo.",
                      "alerta",
                      {
                        soloAceptar: true,
                        onConfirmar: () => window.mostrarSeccion(`editar-correo`)
                      }
                    );
                    return;
                }
                
                if (nuevoCorreo !== confirmarCorreo) {
                    window.configurarAlerta(
                      "Error",
                      "Los correos electrónicos no coinciden.",
                      "alerta",
                      {
                        soloAceptar: true,
                        onConfirmar: () => window.mostrarSeccion(`editar-correo`)
                      }
                    );
                    return;
                }
                
                const inputCorreoNormal = document.querySelector('#perfil .btn-cambiar[data-campo="correo"]')
                    ?.closest('.input-y-boton')
                    ?.querySelector('.input-perfil');
                
                if (inputCorreoNormal) {
                    inputCorreoNormal.value = nuevoCorreo;
                }
            }
            else if (campo === 'contrasena') {
                const nuevaContrasena = document.getElementById('nueva-contrasena')?.value;
                const confirmarContrasena = document.getElementById('confirmar-contrasena')?.value;
                
                if (!nuevaContrasena || !confirmarContrasena) {
                    window.configurarAlerta(
                      "Error",
                      "Por favor completa ambos campos de contraseña.",
                      "alerta",
                      {
                        soloAceptar: true,
                        onConfirmar: () => window.mostrarSeccion(`editar-contrasena`)
                      }
                    );
                    return;
                }
                
                if (nuevaContrasena !== confirmarContrasena) {
                    window.configurarAlerta(
                      "Error",
                      "Las contraseñas no coinciden.",
                      "alerta",
                      {
                        soloAceptar: true,
                        onConfirmar: () => window.mostrarSeccion(`editar-contrasena`)
                      }
                    );
                    return;
                }
                
                console.log('Contraseña actualizada');
            }
            else if (campo === 'nombre') {
                const inputEdicion = this.querySelector('.input-edicion');
                const nuevoValor = inputEdicion?.value;
                
                if (!nuevoValor) {
                    window.configurarAlerta(
                      "Error",
                      "Por favor ingresa un nombre.",
                      "alerta",
                      {
                        soloAceptar: true,
                        onConfirmar: () => window.mostrarSeccion(`editar-nombre`)
                      }
                    );
                    return;
                }
                
                const inputNormal = document.querySelector(`#perfil .btn-cambiar[data-campo="${campo}"]`)
                    ?.closest('.input-y-boton')
                    ?.querySelector('.input-perfil');
                
                if (inputNormal) {
                    inputNormal.value = nuevoValor;
                }
            }
            
            // Regresar al perfil principal
            document.querySelectorAll('#editar-nombre, #editar-correo, #editar-contrasena').forEach(seccion => {
                seccion.classList.remove('activa');
                seccion.style.display = 'none';
            });
            document.getElementById('perfil').classList.add('activa');
            document.getElementById('perfil').style.display = 'block';
            
            window.configurarAlerta(
              "Éxito",
              "Cambios guardados correctamente",
              "exito",
              {
                soloAceptar: true,
                onConfirmar: () => window.mostrarSeccion("perfil")
              }
            );
        });
    });

    inicializarSubidaFoto();
    
    console.log("✅ Perfil inicializado correctamente");
  }

  // === FUNCIONALIDAD PARA SUBIR FOTO ===
  function inicializarSubidaFoto() {
    const btnImportarFoto = document.getElementById('btnImportarFoto');
    const linkImportarFoto = document.querySelector('.link-importar-foto');
    
    const cancelarCambiarFoto = document.getElementById('cancelarCambiarFoto');
    const subirCambiarFoto = document.getElementById('subirCambiarFoto');
    
    const cancelBtn = document.getElementById('cancelBtn');
    const confirmBtn = document.getElementById('confirmBtn');

    if (btnImportarFoto) {
        btnImportarFoto.addEventListener('click', function(e) {
            e.preventDefault();
            window.mostrarSeccion("alerta-cambiar-foto");
        });
    }

    if (linkImportarFoto) {
        linkImportarFoto.addEventListener('click', function(e) {
            e.preventDefault();
            window.mostrarSeccion("alerta-cambiar-foto");
        });
    }

    if (cancelarCambiarFoto) {
        cancelarCambiarFoto.addEventListener('click', function() {
            window.mostrarSeccion("perfil");
        });
    }

    if (subirCambiarFoto) {
        subirCambiarFoto.addEventListener('click', function() {
            mostrarConfirmacion('../../assets/img/perfil.png');
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            ocultarConfirmacion();
            window.mostrarSeccion("perfil");
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            confirmarFoto();
        });
    }
  }

  // === ALERTA PARA ELIMINAR CUENTA DE USUARIO ===
  function inicializarEliminarCuenta() {
      const linkEliminarCuenta = document.querySelector('.link-eliminar-cuenta');
      
      if (linkEliminarCuenta) {
          linkEliminarCuenta.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              mostrarAlertaConfirmarEliminarCuenta();
          });
          
          const links = document.querySelectorAll('a');
          links.forEach(link => {
              if (link.textContent.includes('Eliminar mi cuenta')) {
                  link.addEventListener('click', function(e) {
                      e.preventDefault();
                      mostrarAlertaConfirmarEliminarCuenta();
                  });
              }
          });
      }
  }

  function mostrarAlertaConfirmarEliminarCuenta() {
      seccionAntesDeEliminar = "perfil";
      
      window.configurarAlerta(
          "Eliminar Cuenta",
          "¿Estás seguro que deseas eliminar tu perfil?<br><strong>Esta acción eliminará todos sus datos y no podrá recuperarlos.</strong>",
          "alerta",
          {
              textoConfirmar: "Eliminar",
              onConfirmar: () => {
                  eliminarUsuarioDeSistema();
              },
              onCancelar: () => {
                  window.mostrarSeccion("perfil");
              }
          }
      );
  }

  // function eliminarUsuarioDeSistema() {
  //     // - Llamada a API (delete_user.php)
  //     // - Eliminar de base de datos  
  //     // - Limpiar localStorage/sessionStorage
      
  //     setTimeout(() => {
  //         mostrarAlertaCuentaEliminada();
  //     }, 500);
  // }

  function mostrarAlertaCuentaEliminada() {
      window.configurarAlerta(
          "Cuenta Eliminada",
          "Tu cuenta ha sido eliminada exitosamente.<br>Serás redirigido a la página de inicio.",
          "exito", 
          {
              soloAceptar: true,
              onConfirmar: () => {
                  window.location.href = "../../index.html";
              }
          }
      );
  }

  // === FUNCIÓN PARA NAVEGACIÓN DESDE REPORTES ===
  function inicializarNavegacionReportes() {
    console.log("Inicializando navegación desde reportes...");
    
    const tarjetasMetricas = document.querySelectorAll('.tarjeta-metrica');
    
    tarjetasMetricas.forEach(tarjeta => {
        tarjeta.style.cursor = 'pointer';
        
        tarjeta.addEventListener('click', function() {
            const tipoTarea = this.querySelector('h3').textContent.trim().toLowerCase();
            
            if (tipoTarea === 'total de tareas') {
                console.log("Navegando a TAREAS desde Total de tareas");
                window.mostrarSeccion('tareas');
            } else {
                console.log("Navegando a TABLEROS desde:", tipoTarea);
                window.mostrarSeccion('tableros');
            }
        });
    });
    
    const recuadrosProgreso = document.querySelectorAll('.recuadro');
    
    recuadrosProgreso.forEach(recuadro => {
        recuadro.style.cursor = 'pointer';
        
        recuadro.addEventListener('click', function() {
            const titulo = this.querySelector('h3').textContent.trim();
            console.log("Click en recuadro:", titulo);
            
            if (titulo === 'Usuarios activos') {
                console.log("Navegando a USUARIOS desde Usuarios activos");
                window.mostrarSeccion('usuarios');
            } else {
                console.log("Navegando a TABLEROS desde:", titulo);
                window.mostrarSeccion('tableros');
            }
        });
    });
  }

  // Toggle dropdown
  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
      toggle.addEventListener('click', e => {
          e.preventDefault();

          const menu = toggle.nextElementSibling;

          document.querySelectorAll('.dropdown-menu').forEach(m => {
              if (m !== menu) m.style.display = 'none';
          });

          menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
      });
  });

  document.addEventListener('click', e => {
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
          if (!menu.contains(e.target) && !menu.previousElementSibling.contains(e.target)) {
              menu.style.display = 'none';
          }
      });
  });

  document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = toggle.previousElementSibling;
      const svg = toggle.querySelector('svg');

      if (input.type === 'password') {
        input.type = 'text';
        svg.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
      } else {
        input.type = 'password';
        svg.innerHTML = `<path d="M17.94 17.94A10.97 10.97 0 0 1 12 20c-5 0-9.27-3-11-7 1.01-2.21 2.65-4.13 4.66-5.39"/><line x1="1" y1="1" x2="23" y2="23" />`;
      }
    });
  });

  document.querySelectorAll('.login-toggle-password').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = toggle.previousElementSibling;
      const svg = toggle.querySelector('svg');

      if (input.type === 'password') {
        input.type = 'text';
        svg.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
      } else {
        input.type = 'password';
        svg.innerHTML = `<path d="M17.94 17.94A10.97 10.97 0 0 1 12 20c-5 0-9.27-3-11-7 1.01-2.21 2.65-4.13 4.66-5.39"/><line x1="1" y1="1" x2="23" y2="23" />`;
      }
    });
  });

  // === INICIALIZACIÓN COMPLETA ===
  function inicializarTodo() {
      inicializarSistemaTareas();
      // inicializarTablaUsuarios(); // DESHABILITADO - users.js lo maneja
      // inicializarBotonesDetalles(); // DESHABILITADO - users.js lo maneja
      inicializarExportarPDF();
      inicializarPerfil();
      inicializarEliminarCuenta();
      inicializarNavegacionReportes();
  }

  // Inicializar cuando se carga la página
  inicializarTodo();
});