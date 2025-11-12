document.addEventListener("DOMContentLoaded", () => {
  // Función para mostrar secciones
  function mostrarSeccion(id) {
    document.querySelectorAll(".seccion").forEach((s) => s.classList.remove("activa"));
    document.getElementById(id).classList.add("activa");
  }

  // Mostrar inicio al cargar
  mostrarSeccion("inicio");

  // Navegación lateral
  document.querySelectorAll(".sidebar a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      mostrarSeccion(link.dataset.section);
    });
  });

  // --- VARIABLES ---
  const btnAñadirPendiente = document.getElementById("btnAñadirPendiente");
  const formSection = document.getElementById("formulario-tarjeta");
  const form = formSection.querySelector("form");
  const btnCancelar = form.querySelector(".cancelar");
  const contenedorPendiente = document.querySelector("#tableros .columna .tarjetas");

  // Abrir formulario
  btnAñadirPendiente.addEventListener("click", () => {
    mostrarSeccion("formulario-tarjeta");
  });

  // Cancelar formulario
  btnCancelar.addEventListener("click", () => {
    form.reset();
    mostrarSeccion("tableros");
  });

  // Crear tarjeta
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const titulo = form.querySelector('input[type="text"]').value.trim();
    const descripcion = form.querySelector("textarea").value.trim();
    const asignado = form.querySelectorAll("select")[0].value;
    const prioridad = form.querySelectorAll("select")[1].value;
    const fecha = form.querySelector('input[type="date"]').value;

    if (!titulo) {
      alert("Por favor, escribe un título para la tarea.");
      return;
    }

    const nuevaTarjeta = document.createElement("div");
    nuevaTarjeta.classList.add("tarjeta");
    nuevaTarjeta.innerHTML = `
      <h4>${titulo}</h4>
      <p>${descripcion}</p>
      <p><img src="/assets/img/icono-calendario.png" class="icono"> ${fecha}</p>
      <p><img src="/assets/img/icono-usuario.png" class="icono"> ${asignado}</p>
      <p><img src="/assets/img/icono-prioridad.png" class="icono"> ${prioridad}</p>
      <div class="botones-tarjeta">
        <button class="eliminar">
          <img src="/assets/img/basura.png" class="delete-card" alt="Eliminar">
        </button>
        <div class="botones-derecha"> 
          <button class="mover-izq"><</button>
          <button class="mover-der">></button>
        </div>
      </div>
    `;

    contenedorPendiente.appendChild(nuevaTarjeta);
    form.reset();
    mostrarSeccion("tableros");
  });

  // Delegación de eventos para mover/eliminar tarjetas
  document.querySelector(".contenedor-tableros").addEventListener("click", (e) => {
    const tarjeta = e.target.closest(".tarjeta");
    if (!tarjeta) return;

    const columna = e.target.closest(".columna");
    if (e.target.classList.contains("eliminar")) {
      tarjeta.remove();
    } else if (e.target.classList.contains("mover-izq")) {
      const anterior = columna.previousElementSibling?.querySelector(".tarjetas");
      if (anterior) anterior.appendChild(tarjeta);
    } else if (e.target.classList.contains("mover-der")) {
      const siguiente = columna.nextElementSibling?.querySelector(".tarjetas");
      if (siguiente) siguiente.appendChild(tarjeta);
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const addTabBtn = document.querySelector(".add-tab");
  const tabContainer = document.querySelector(".tab-container");
  let tabCount = 1; // porque ya tienes Pestaña 1 y Pestaña 2

  addTabBtn.addEventListener("click", () => {
    tabCount++;

    // Crear nueva pestaña
    const newTab = document.createElement("div");
    newTab.classList.add("tab");
    newTab.textContent = `Pestaña ${tabCount}`;

    // Insertar antes del botón "+"
    tabContainer.insertBefore(newTab, addTabBtn);

    // Opcional: marcar la nueva pestaña como activa
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    newTab.classList.add("active");

    // Crear contenido dinámico (si tienes un contenedor para mostrar contenido)
    const mainContent = document.querySelector(".main-content"); 
    if (mainContent) {
      const newSection = document.createElement("div");
      newSection.classList.add("tab-content");
      newSection.textContent = `Contenido de ${newTab.textContent}`;
      mainContent.appendChild(newSection);
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const seccionEliminar = document.getElementById("eliminarTarjeta");
  const cancelarEliminar = document.getElementById("cancelarEliminar");
  const confirmarEliminar = document.getElementById("confirmarEliminar");

  let tarjetaAEliminar = null;

  // Al hacer clic en el icono de eliminar
  document.addEventListener("click", e => {
    if (e.target.classList.contains("delete-card")) {
      tarjetaAEliminar = e.target.closest(".tarjeta"); // asegúrate que tus tarjetas tienen esta clase
      document.querySelectorAll(".seccion").forEach(s => s.classList.remove("activa"));
      seccionEliminar.classList.add("activa");
    }
  });

  // Cancelar la eliminación
  cancelarEliminar.addEventListener("click", () => {
    seccionEliminar.classList.remove("activa");
    document.getElementById("tableros").classList.add("activa"); // vuelve a la sección de tableros
    tarjetaAEliminar = null;
  });

  // Confirmar eliminación
  confirmarEliminar.addEventListener("click", () => {
    if (tarjetaAEliminar) {
      tarjetaAEliminar.remove(); // elimina la tarjeta del DOM
      tarjetaAEliminar = null;
    }
    seccionEliminar.classList.remove("activa");
    document.getElementById("tableros").classList.add("activa"); // muestra el tablero actual
  });
});


// --- ALERTA DE CERRAR SESIÓN ---
const botonCerrarSesion = document.querySelector('.user-info a img'); // ícono de cerrar sesión
const seccionCerrarSesion = document.getElementById('cerrarSesion');
const btnCancelarCerrar = document.getElementById('cancelarCerrarSesion');
const btnConfirmarCerrar = document.getElementById('confirmarCerrarSesion');

// Mostrar alerta al dar clic en el icono de cerrar sesión
botonCerrarSesion.addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelectorAll(".seccion").forEach(s => s.classList.remove("activa"));
  seccionCerrarSesion.classList.add("activa");
});

// Cancelar cierre de sesión
btnCancelarCerrar.addEventListener('click', () => {
  seccionCerrarSesion.classList.remove("activa");
  document.getElementById('inicio').classList.add('activa'); // vuelve a inicio o a donde tú prefieras
});

// Confirmar cierre de sesión
btnConfirmarCerrar.addEventListener('click', () => {
  // Aquí puedes redirigir o limpiar datos según necesites
  window.location.href = "/index.html"; // redirige a la página principal
});

