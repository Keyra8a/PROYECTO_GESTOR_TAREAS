document.addEventListener("DOMContentLoaded", () => {

  // --- Cambiar entre secciones ---
  function mostrarSeccion(id) {
    // Oculta todas
    const secciones = document.querySelectorAll(".seccion");
    secciones.forEach(sec => sec.classList.remove("activa"));

    // Muestra la elegida
    const seccionActiva = document.getElementById(id);
    if (seccionActiva) {
      seccionActiva.classList.add("activa");

      // Cambiar título de pestaña dinámicamente
      const titulo = seccionActiva.querySelector("h2");
      if (titulo) {
        document.title = "TaskColab - " + titulo.textContent;
      }
    }
  }

  // --- Detectar clicks en el menú lateral ---
  const enlaces = document.querySelectorAll(".sidebar a");
  enlaces.forEach(enlace => {
    enlace.addEventListener("click", e => {
      e.preventDefault();
      const id = enlace.getAttribute("data-section");
      mostrarSeccion(id);
    });
  });

  // --- Mostrar inicio al cargar ---
  mostrarSeccion("inicio");
});

// --- Control de secciones (inicio, tableros, tareas, etc.) ---
document.addEventListener("DOMContentLoaded", () => {
  // Mostrar solo la sección "inicio" al cargar
  mostrarSeccion("inicio");

  // Control del menú lateral
  const linksMenu = document.querySelectorAll(".sidebar a");
  linksMenu.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const id = link.dataset.section;
      if (id) mostrarSeccion(id);
    });
  });

  // Control del botón "+" de las columnas
  const botonesAdd = document.querySelectorAll(".add-card");
  botonesAdd.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const tipo = btn.dataset.seccion || "pendiente";
      const titulo = document.querySelector("#formulario-tarjeta h3");
      titulo.textContent = `Añadir Tarjeta - ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
      mostrarSeccion("formulario-tarjeta");
    });
  });

  // Botón "Cancelar" dentro del formulario
  const btnCancelar = document.querySelector("#formulario-tarjeta .cancelar");
  if (btnCancelar) {
    btnCancelar.addEventListener("click", () => {
      mostrarSeccion("tableros");
    });
  }
});

// Función para cambiar secciones
function mostrarSeccion(id) {
  const secciones = document.querySelectorAll(".seccion");
  secciones.forEach(seccion => seccion.classList.remove("activa"));

  const seccionActiva = document.getElementById(id);
  if (seccionActiva) {
    seccionActiva.classList.add("activa");
  }
}
