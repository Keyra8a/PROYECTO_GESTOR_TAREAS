// assets/javascript/users.js
document.addEventListener('DOMContentLoaded', () => {
  console.log("users.js cargado - Inicializando...");

  // === ELEMENTOS DEL DOM ===
  const tbody = document.querySelector('.tabla-usuarios');
  const detalleNombre = document.getElementById('detNombre');
  const detalleCorreo = document.getElementById('detCorreo');
  const detalleTareas = document.getElementById('detTareas');
  const detalleEstado = document.getElementById('detEstado');
  const detalleFecha = document.getElementById('detFecha');

  const inputEditNombre = document.getElementById('editNombre');
  const inputEditCorreo = document.getElementById('editCorreo');
  const inputEditTareas = document.getElementById('editTareas');
  const inputEditEstado = document.getElementById('editEstado');
  const inputEditFecha = document.getElementById('editFecha');

  const btnVolver = document.getElementById('btnVolverUsuario');
  const btnEditarDesdeDetalle = document.getElementById('btnEditarUsuario');
  const btnEliminarDesdeDetalle = document.getElementById('btnEliminarUsuario');
  const btnAceptarEditar = document.getElementById('btnAceptarEditar');
  const btnCancelarEditar = document.getElementById('btnCancelarEditar');

  // === VARIABLES GLOBALES ===
  let usersCache = [];
  let usuarioSeleccionado = null;
  
  // SISTEMA MEJORADO DE CONTROL DE EVENTOS
  let controlEventos = {
      ultimoEvento: null,
      enProgreso: false,
      timeout: null
  };

  // Función para manejar eventos de tareas asignadas
    async function manejarTareasAsignadas(event) {
        console.log("===== USERS.JS: EVENTO 'tareasAsignadasDesdeAdmin' =====");
        console.log("Detalles:", event.detail);
        console.log("Usuario ID:", event.detail.userId);
        console.log("Tareas asignadas:", event.detail.taskIds?.length || 0);
        console.log("Hora:", new Date().toLocaleTimeString());
        
        // FORZAR recarga inmediata sin debounce
        console.log("FORZANDO RECARGA INMEDIATA DE USUARIOS");
        
        try {
            await loadUsers();
            console.log("Usuarios recargados después de asignación de tareas");
        } catch (error) {
            console.error("Error recargando usuarios:", error);
        }
        
        console.log("===== FIN EVENTO =====\n");
    }

    // FUNCIÓN ESPECÍFICA PARA MANEJAR actualizarConteoTareas
    async function manejarActualizarConteo(event) {
        console.log("===== USERS.JS: EVENTO 'actualizarConteoTareas' =====");
        console.log("Detalles:", event.detail);
        console.log("Hora:", new Date().toLocaleTimeString());
        
        // Recargar usuarios inmediatamente
        console.log("Recargando tabla de usuarios...");
        await loadUsers();
        
        console.log("Tabla de usuarios actualizada");
        console.log("===== FIN EVENTO =====\n");
    }

  // API base
  const apiBase = (window.API_BASE && window.API_BASE.trim()) ? 
      window.API_BASE.replace(/\/$/, '') : '/assets/app/endpoints';

  console.log("API_BASE configurado:", apiBase);

  // === FUNCIÓN DEBOUCE MEJORADA ===
  function debounceLoadUsers() {
      if (controlEventos.timeout) {
          clearTimeout(controlEventos.timeout);
      }
      
      controlEventos.timeout = setTimeout(async () => {
          console.log("Ejecutando recarga debounceada...");
          controlEventos.enProgreso = true;
          await loadUsers();
          controlEventos.enProgreso = false;
          console.log("Recarga debounceada completada");
      }, 1500);
  }

  // === CARGAR USUARIOS ===
  async function loadUsers() {
      try {
          const timestamp = Date.now();
          const random = Math.floor(Math.random() * 1000000);
          const url = `${apiBase}/list_users.php?t=${timestamp}&r=${random}&_=${Date.now()}`;
          
          console.log('Cargando usuarios desde:', url);
          
          const res = await fetch(url, { 
              method: 'GET',
              cache: 'no-store',
              headers: {
                  'Accept': 'application/json',
                  'Cache-Control': 'no-cache, no-store, must-revalidate',
                  'Pragma': 'no-cache',
                  'Expires': '0'
              }
          });
          
          console.log('Respuesta HTTP:', res.status, res.statusText);
          
          if (!res.ok) {
              throw new Error(`HTTP ${res.status}`);
          }
          
          const json = await res.json();
          console.log('Datos recibidos del servidor:', json);
          
          if (!json.ok) {
              throw new Error(json.message || 'Error en la respuesta del servidor');
          }
          
          if (!Array.isArray(json.users)) {
              console.warn('Respuesta inesperada, users no es array');
              usersCache = [];
          } else {
              usersCache = json.users;
          }
          
          // Mostrar conteo actualizado
          console.log('USUARIOS CARGADOS:');
          if (usersCache.length === 0) {
              console.log('    No hay usuarios para mostrar');
          } else {
              usersCache.forEach(user => {
                  console.log(` ${user.name}: ${user.assigned_count || 0} tareas`);
              });
          }
          
          renderTable(usersCache);
          console.log('Tabla de usuarios actualizada correctamente');
          
      } catch (err) {
          console.error('ERROR en loadUsers:', err);
          if (tbody) {
              tbody.innerHTML = `
                  <tr>
                      <td colspan="4" style="text-align: center; color: red; padding: 20px;">
                          Error al cargar usuarios
                      </td>
                  </tr>
              `;
          }
      }
  }

    // === RENDERIZAR TABLA MEJORADA CON USUARIOS INACTIVOS ===
    function renderTable(users) {
        if (!tbody) {
            console.error("No se encontró tbody para la tabla de usuarios");
            return;
        }

        if (!users || users.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; color: #666; padding: 20px;">
                        No hay usuarios registrados
                    </td>
                </tr>
            `;
            return;
        }

        console.log(`Renderizando ${users.length} usuarios en la tabla`);
        
        const current = window.CURRENT_USER || null;
        
        tbody.innerHTML = users.map(user => {
            // DETERMINAR ESTILOS SEGÚN ESTADO
            const esUsuarioActual = current && String(current.id) === String(user.id);
            const esActivo = user.is_active == 1;
            
            let estiloFila = '';
            let marcadorEstado = '';
            
            if (esUsuarioActual) {
                estiloFila = 'background-color: #e3f2fd;'; 
                marcadorEstado = ' (Tú)';
            } else if (!esActivo) {
                estiloFila = 'background-color: #f5f5f5; color: #999;'; 
                marcadorEstado = ' (Inactivo)';
            }
            
            return `
                <tr data-id="${user.id}" style="${estiloFila}">
                    <td>${escapeHtml(user.name)}${marcadorEstado}</td>
                    <td>${escapeHtml(user.email)}</td>
                    <td>${user.assigned_count || 0}</td>
                    <td>${escapeHtml(user.notes || '')}</td>
                </tr>
            `;
        }).join('');
        
        console.log(`${users.length} usuarios renderizados (incluyendo inactivos)`);
    }

    // === FUNCIÓN PARA ACTUALIZAR VISTA DE DETALLE ===
    function actualizarVistaDetalle(user) {
        console.log("Actualizando vista detalle:", user);
        
        if (!user) {
            console.error("Usuario es null");
            return;
        }
        
        if (detalleNombre) detalleNombre.textContent = user.name || '';
        if (detalleCorreo) detalleCorreo.textContent = user.email || '';
        if (detalleTareas) detalleTareas.textContent = `${user.assigned_count || 0} tareas`;
        
        // MOSTRAR ESTADO SIMPLE
        if (detalleEstado) {
            const esActivo = user.is_active == 1;
            detalleEstado.textContent = esActivo ? 'Activo' : 'Inactivo';
        }
        
        // FECHA
        if (detalleFecha) {
            if (user.last_login && user.last_login !== '0000-00-00 00:00:00') {
                try {
                    const fecha = new Date(user.last_login);
                    if (!isNaN(fecha.getTime())) {
                        detalleFecha.textContent = fecha.toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    } else {
                        detalleFecha.textContent = 'Fecha inválida';
                    }
                } catch (error) {
                    detalleFecha.textContent = user.last_login;
                }
            } else {
                detalleFecha.textContent = 'Sin actividad';
            }
        }
        
        console.log("Vista detalle actualizada");
    }

    // === FUNCIÓN PARA ACTUALIZAR FORMULARIO DE EDICIÓN ===
    function actualizarFormularioEdicion(user) {
        console.log("Actualizando formulario de edición:", user);
        
        if (inputEditNombre) inputEditNombre.value = user.name || '';
        if (inputEditCorreo) inputEditCorreo.value = user.email || '';
        if (inputEditTareas) inputEditTareas.value = user.assigned_count || '0';
        if (inputEditEstado) inputEditEstado.value = user.is_active == 1 ? '1' : '0';
        
        // MOSTRAR FECHA ACTUAL EN EL FORMULARIO
        if (inputEditFecha) {
            if (user.last_login && user.last_login !== '0000-00-00 00:00:00') {
                try {
                    const fecha = new Date(user.last_login);
                    if (!isNaN(fecha.getTime())) {
                        inputEditFecha.value = fecha.toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    } else {
                        inputEditFecha.value = 'Fecha inválida';
                    }
                } catch (error) {
                    inputEditFecha.value = user.last_login;
                }
            } else {
                inputEditFecha.value = 'Sin actividad';
            }
        }
        
        console.log("Formulario de edición actualizado");
    }

  // === FUNCIÓN PARA ACTUALIZAR FILA EN TABLA ===
  function actualizarFilaEnTabla(user) {
      if (!user || !user.id) {
          console.warn("No se puede actualizar fila: usuario inválido");
          return;
      }
      
      const fila = document.querySelector(`tr[data-id="${user.id}"]`);
      if (fila) {
          const celdas = fila.querySelectorAll('td');
          if (celdas.length >= 4) {
              celdas[0].textContent = user.name || '';
              celdas[1].textContent = user.email || '';
              celdas[2].textContent = user.assigned_count || '0';
              celdas[3].textContent = user.notes || '';
          }
          console.log("Fila actualizada en tabla principal");
      }
  }

  // === EVENT LISTENERS ===

  // Click en fila de usuario
  tbody?.addEventListener('click', (e) => {
      const tr = e.target.closest('tr');
      if (!tr) return;
      const id = tr.dataset.id;
      if (!id) return;
      
      console.log(`Click en usuario ID: ${id}`);
      
      const user = usersCache.find(x => String(x.id) === String(id));
      if (user) {
          abrirDetalle(user);
      }
  });

  // Evento de actualización de tareas
  window.addEventListener('actualizarConteoTareas', async (event) => {     
     console.log("===== EVENTO 'actualizarConteoTareas' CAPTURADO EN USERS.JS =====");
     console.log("Detalles del evento:", event.detail);
     console.log("Hora del evento:", new Date().toLocaleTimeString());

     console.log("Recargando tabla de usuarios INMEDIATAMENTE...");
     await loadUsers();
        
     console.log("Conteo de tareas actualizado en tiempo real");
     console.log("===== FIN EVENTO =====\n");
  });

  // Evento de tarea creada
  window.addEventListener('tareaCreada', async (event) => {
      console.log("EVENTO 'tareaCreada' recibido");
      await loadUsers();
  });

  // ESCUCHAR EVENTO DE TAREAS ELIMINADAS
  window.addEventListener('tareasEliminadas', async (event) => {
    console.log("===== EVENTO 'tareasEliminadas' RECIBIDO EN PROFILE.JS =====");
    console.log("Detalles:", event.detail);
    console.log(`${event.detail.deleted_count} tarea(s) eliminada(s)`);
        
    // RECARGAR ACTIVIDAD INMEDIATAMENTE
    console.log("Recargando actividad del perfil...");
    await cargarActividadUsuario(true);
        
    console.log("Actividad actualizada después de eliminar tareas");
    console.log("===== FIN EVENTO =====\n");
  });

    console.log("Listener 'tareasEliminadas' registrado en profile.js");

  // Evento de perfil actualizado
  window.addEventListener('perfilActualizado', async (event) => {
      console.log("EVENTO 'perfilActualizado' recibido");
      
      const eventoId = event.detail.timestamp;
      
      if (controlEventos.ultimoEvento === eventoId || controlEventos.enProgreso) {
          console.log("Evento duplicado/en progreso, ignorando...");
          return;
      }
      
      controlEventos.ultimoEvento = eventoId;
      
      // Actualizar CURRENT_USER
      if (event.detail.nombre) {
          window.CURRENT_USER.name = event.detail.nombre;
      }
      if (event.detail.email) {
          window.CURRENT_USER.email = event.detail.email;
      }
      
      debounceLoadUsers();
  });

  // === FUNCIONES DE DETALLE ===
  function abrirDetalle(user) {
      console.log(`Abriendo detalle del usuario: ${user.name}`);
      
      usuarioSeleccionado = user;
      actualizarVistaDetalle(user);

      const current = window.CURRENT_USER || null;
      
      // SOLO PERMITIR EDITAR SU PROPIO PERFIL (incluso si es admin)
      const esMismoUsuario = current && String(current.id) === String(user.id);

      console.log(`Es mismo usuario: ${esMismoUsuario}`);
      console.log(`Edición permitida: ${esMismoUsuario ? 'SÍ' : 'NO'}`);

      // MOSTRAR BOTÓN DE EDICIÓN SOLO SI ES SU PROPIO PERFIL
      if (btnEditarDesdeDetalle) {
          btnEditarDesdeDetalle.style.display = esMismoUsuario ? 'inline-block' : 'none';
      }
      
      if (btnEliminarDesdeDetalle) {
          btnEliminarDesdeDetalle.style.display = 'none'; 
      }

      if (typeof mostrarSeccion === 'function') {
          mostrarSeccion('detalleUsuario');
      }
  }

  // === FUNCIONES DE EDICIÓN ===

  btnEditarDesdeDetalle?.addEventListener('click', () => {
      if (!usuarioSeleccionado) return;
      
      console.log(`Abriendo edición para: ${usuarioSeleccionado.name}`);
      
      // USAR FUNCIÓN ESPECIALIZADA PARA ACTUALIZAR FORMULARIO
      actualizarFormularioEdicion(usuarioSeleccionado);

      if (typeof mostrarSeccion === 'function') {
          mostrarSeccion('editarUsuario');
      }
  });

  btnAceptarEditar?.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!usuarioSeleccionado) {
          console.error("No hay usuario seleccionado");
          return;
      }
      
      const id = usuarioSeleccionado.id;
      if (!id) {
          console.error("ID de usuario inválido");
          return;
      }

      console.log("Iniciando proceso de guardado para usuario ID:", id);
      
      // MOSTRAR DATOS ANTES DE GUARDAR
      console.log("Datos a guardar:");
      console.log("   - Nombre:", inputEditNombre?.value);
      console.log("   - Email:", inputEditCorreo?.value);
      console.log("   - Estado:", inputEditEstado?.value);

      if (typeof configurarAlerta === 'function') {
          configurarAlerta(
              "Confirmar Cambios",
              "¿Estás seguro de que deseas guardar los cambios realizados?",
              "alerta",
              {
                  textoConfirmar: "Confirmar",
                  onConfirmar: async () => {
                      console.log("Usuario confirmó guardar cambios");
                      await guardarCambiosUsuario(id);
                  },
                  onCancelar: () => {
                      console.log("Usuario canceló la edición");
                      if (typeof mostrarSeccion === 'function') mostrarSeccion('editarUsuario');
                  }
              }
          );
      } else {
          if (confirm("¿Estás seguro de guardar los cambios?")) {
              await guardarCambiosUsuario(id);
          }
      }
  });

  async function guardarCambiosUsuario(id) {
      // PAYLOAD SIN last_login
      const payload = {
          id,
          name: inputEditNombre.value.trim(),
          email: inputEditCorreo.value.trim(),
          notes: usuarioSeleccionado.notes || '', 
          is_active: parseInt(inputEditEstado.value)
      };

      console.log("ENVIANDO:", payload);

      try {
          const res = await fetch(`${apiBase}/update_user.php`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          
          const json = await res.json();
          console.log("RESPUESTA SERVIDOR:", json);
          
          if (json.ok && json.user) {
              console.log(`Usuario ${id} actualizado`);
              
              // ACTUALIZAR CACHE
              const idx = usersCache.findIndex(u => String(u.id) === String(id));
              if (idx !== -1) {
                  usersCache[idx] = json.user;
                  console.log("Cache actualizado");
              }
              
              // ACTUALIZAR USUARIO SELECCIONADO
              usuarioSeleccionado = json.user;
              
              // ACTUALIZAR VISTAS
              actualizarVistaDetalle(json.user);
              actualizarFilaEnTabla(json.user);
              
              // ACTUALIZAR CURRENT_USER SI CORRESPONDE
              const current = window.CURRENT_USER;
              if (current && String(current.id) === String(id)) {
                  window.CURRENT_USER.name = json.user.name;
                  window.CURRENT_USER.email = json.user.email;
                  
                  const headerName = document.querySelector('.user-info h3');
                  if (headerName) headerName.textContent = json.user.name;
                  
                  const profileCircle = document.querySelector('.profile-circle');
                  if (profileCircle && !current.avatar_url) {
                      profileCircle.textContent = json.user.name.charAt(0).toUpperCase();
                  }
                  
                  // DISPARAR EVENTO PARA PROFILE.JS
                  console.log("Disparando evento 'usuarioActualizado' para profile.js");
                  const evento = new CustomEvent('usuarioActualizado', {
                      detail: {
                          nombre: json.user.name,
                          email: json.user.email,
                          user: json.user,
                          timestamp: new Date().getTime()
                      }
                  });
                  window.dispatchEvent(evento);
              }
              
              // REGRESAR A DETALLE
              setTimeout(() => {
                  if (typeof mostrarSeccion === 'function') {
                      mostrarSeccion('detalleUsuario');
                  }
              }, 100);
              
              // Alerta éxito
              if (typeof configurarAlerta === 'function') {
                  configurarAlerta(
                      "Cambios Realizados",
                      "Usuario actualizado correctamente",
                      "exito",
                      { soloAceptar: true }
                  );
              }
              
          } else {
              throw new Error(json.message || 'Error del servidor');
          }
      } catch (err) {
          console.error('ERROR:', err);
          if (typeof configurarAlerta === 'function') {
              configurarAlerta(
                  "Error",
                  "Error al actualizar: " + err.message,
                  "alerta",
                  { soloAceptar: true }
              );
          }
      }
  }

  // FUNCIÓN DE DEBUG PARA VERIFICAR DATOS
  function debugUsuarioActual() {
      console.log("DEBUG - DATOS ACTUALES:");
      console.log("Usuario seleccionado:", usuarioSeleccionado);
      console.log("Cache usuarios:", usersCache.length);
      console.log("CURRENT_USER:", window.CURRENT_USER);
      
      if (usuarioSeleccionado) {
          console.log("last_login:", usuarioSeleccionado.last_login);
          console.log("assigned_count:", usuarioSeleccionado.assigned_count);
          console.log("email:", usuarioSeleccionado.email);
          console.log("name:", usuarioSeleccionado.name);
      }
      
      // Verificar elementos del DOM
      console.log("detalleNombre:", detalleNombre?.textContent);
      console.log("detalleCorreo:", detalleCorreo?.textContent);
      console.log("detalleFecha:", detalleFecha?.textContent);
      console.log("detalleTareas:", detalleTareas?.textContent);
  }

  // === BOTONES ===

  btnVolver?.addEventListener('click', () => {
      if (typeof mostrarSeccion === 'function') mostrarSeccion('usuarios');
  });

  btnCancelarEditar?.addEventListener('click', () => {
      if (usuarioSeleccionado) {
          abrirDetalle(usuarioSeleccionado);
      } else {
          if (typeof mostrarSeccion === 'function') mostrarSeccion('usuarios');
      }
  });

  btnEliminarDesdeDetalle?.addEventListener('click', () => {
      return; 
  });

  // === FUNCIONES UTILITARIAS ===

  function escapeHtml(str = '') {
      return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
  }

  // === INICIALIZACIÓN ===

  console.log("Inicializando tabla de usuarios...");
  console.log("Listeners registrados en profile.js:");
  console.log("   - usuarioActualizado");
  console.log("   - tareaCreada");
  console.log("   - tareasEliminadas");
  
  // Cargar usuarios
  setTimeout(() => {
      loadUsers();
  }, 500);

    // === LISTENERS PARA AUTO-REFRESH ===
    window.addEventListener('tareaCreadadesdeTableros', async (event) => {
        console.log('USERS: Tarea creada desde Tableros', event.detail);
        await loadUsers();
        console.log('Usuarios actualizados después de creación de tarea');
    });

    window.addEventListener('tareaCreadaDesdeTareas', async (event) => {
        console.log('USERS: Tarea creada desde Tareas', event.detail);
        await loadUsers();
        console.log('Usuarios actualizados después de creación de tarea');
    });

    window.addEventListener('tareaEliminadaDesdeTareas', async (event) => {
        console.log('USERS: Tarea eliminada desde Tareas', event.detail);
        await loadUsers();
        console.log('Usuarios actualizados después de eliminación de tarea');
    });

    window.addEventListener('tareaEliminadaDesdeTableros', async (event) => {
        console.log('USERS: Tarea eliminada desde Tableros', event.detail);
        await loadUsers();
        console.log('Usuarios actualizados después de eliminación de tarea');
    });

    window.addEventListener('usuarioCreadoDesdeAdmin', async (event) => {
        console.log('USERS: Usuario creado desde Admin', event.detail);
        await loadUsers();
        console.log('Lista de usuarios actualizada');
    });

    window.addEventListener('usuarioEliminadoDesdeAdmin', async (event) => {
        console.log('USERS: Usuario eliminado desde Admin', event.detail);
        await loadUsers();
        console.log('Lista de usuarios actualizada');
    });

    // === LISTENERS PARA AUTO-REFRESH DESDE ADMIN ===

    // Evento de tareas asignadas desde Admin
    window.addEventListener('tareasAsignadasDesdeAdmin', manejarTareasAsignadas);

    // Evento de actualización de conteo de tareas
    window.addEventListener('actualizarConteoTareas', manejarActualizarConteo);

    // Evento de usuario actualizado desde Admin
    window.addEventListener('usuarioActualizadoDesdeAdmin', async (event) => {
        console.log('USERS: Usuario actualizado desde Admin', event.detail);
        await loadUsers();
        console.log('Lista de usuarios actualizada');
    });

  console.log("users.js inicializado correctamente");
});