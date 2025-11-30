// assets/javascript/tasks.js
document.addEventListener('DOMContentLoaded', function() {
  console.log("Inicializando tasks.js...");

  // === ELEMENTOS DEL DOM ===
  const tbody = document.querySelector('.tabla-tareas tbody');
  const btnAnadirTarea = document.querySelector('.btn-azul');
  const btnEliminarSeleccionadas = document.getElementById('btn-borrar-tareas');
  const formAnadirTarea = document.querySelector('#formulario-tarea form');
  const btnCancelarTarea = document.querySelector('#formulario-tarea .cancelar');
  
  // Inputs del formulario
  const inputTitulo = document.getElementById('titulo-tarea');
  const inputDescripcion = document.getElementById('descripcion-tarea');
  const selectUsuario = document.getElementById('asignar-a');
  const selectEstado = document.getElementById('estado');
  const selectPrioridad = document.getElementById('prioridad');
  const inputFecha = document.getElementById('fecha');

  // API base
  const apiBase = (window.API_BASE && window.API_BASE.trim()) ? 
      window.API_BASE.replace('/endpoints', '/endpointsTareas') : 
      '/assets/app/endpointsTareas';

  console.log("API_BASE Tareas configurado:", apiBase);

  // --- CONVERSIÓN DE ESTADOS Y PRIORIDADES ---
  function statusToBackend(status) {
      console.log("Convirtiendo estado frontend a backend:", status);
      const statusMap = {
          'pending': 'Pendiente',
          'in_progress': 'En proceso', 
          'completed': 'Completado',
          'done': 'Completado'
      };
      const result = statusMap[status] || 'Pendiente';
      console.log("Estado convertido:", result);
      return result;
  }

  function priorityToBackend(priority) {
      console.log("Convirtiendo prioridad frontend a backend:", priority);
      const priorityMap = {
          'low': 'Baja',
          'medium': 'Media',
          'high': 'Alta'
      };
      const result = priorityMap[priority] || 'Media';
      console.log("Prioridad convertida:", result);
      return result;
  }

  function statusToFrontend(status) {
      console.log("Convirtiendo estado backend a frontend:", status);
      const statusMap = {
          'Pendiente': 'Pendiente',
          'En proceso': 'En Proceso', 
          'Completado': 'Completada',
          'pending': 'Pendiente',
          'in_progress': 'En Proceso',
          'completed': 'Completada'
      };
      const result = statusMap[status] || 'Pendiente';
      console.log("Estado convertido:", result);
      return result;
  }

  function priorityToFrontend(priority) {
      console.log("Convirtiendo prioridad backend a frontend:", priority);
      const priorityMap = {
          'Baja': 'Baja',
          'Media': 'Media',
          'Alta': 'Alta',
          'low': 'Baja',
          'medium': 'Media',
          'high': 'Alta'
      };
      const result = priorityMap[priority] || 'Media';
      console.log("Prioridad convertida:", result);
      return result;
  }

  // Inicializar
  loadTasks();
  loadUsersForAssignment();

  // === CARGAR TAREAS ===
  async function loadTasks() {
      try {
          console.log('Cargando tareas...');
          const timestamp = new Date().getTime();
          const url = `${apiBase}/get_user_tasks.php?t=${timestamp}`;
          
          const res = await fetch(url, {
              method: 'GET',
              cache: 'no-cache',
              headers: {
                  'Cache-Control': 'no-cache, no-store, must-revalidate',
                  'Pragma': 'no-cache',
                  'Expires': '0'
              }
          });
          
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          
          const json = await res.json();
          console.log('Tareas recibidas del servidor:', json);
          
          if (json.ok && json.tasks) {
              // CONVERTIR ESTADOS Y PRIORIDADES AL FORMATO FRONTEND
              const tasksWithConvertedStatus = json.tasks.map(task => {
                  console.log("Convirtiendo tarea:", {
                      id: task.id,
                      statusOriginal: task.status,
                      priorityOriginal: task.priority
                  });
                  
                  return {
                      ...task,
                      status: statusToFrontend(task.status),
                      priority: priorityToFrontend(task.priority)
                  };
              });
              
              console.log("Tareas convertidas:", tasksWithConvertedStatus);
              renderTasks(tasksWithConvertedStatus);
              console.log(`${tasksWithConvertedStatus.length} tareas cargadas y convertidas`);
          } else {
              console.warn("No hay tareas o respuesta inválida");
              renderTasks([]);
          }
      } catch (error) {
          console.error('Error cargando tareas:', error);
          renderTasks([]);
      }
  }

  function renderTasks(tasks) {
      if (!tbody) {
          console.error("No se encontró tbody en la tabla");
          return;
      }

      if (!tasks || tasks.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#666;">No hay tareas asignadas</td></tr>';
          return;
      }

      // DEBUG: Ver detalles COMPLETOS de las tareas
      console.log("Renderizando tareas - DETALLES COMPLETOS:");
      tasks.forEach((task, index) => {
          console.log(`   Tarea ${index + 1}:`, {
              id: task.id,
              title: task.title,
              description: task.description,
              status: task.status,
              priority: task.priority,
              due_date: task.due_date,
              board_title: task.board_title,
              assigned_users: task.assigned_users
          });
      });

      tbody.innerHTML = tasks.map(task => `
          <tr data-task-id="${task.id}">
              <td><div class="check-cuadro" data-task-id="${task.id}"></div></td>
              <td>${escapeHtml(task.description || task.title || 'Sin descripción')}</td> <!-- DESCRIPCIÓN en columna Tarea -->
              <td>${escapeHtml(task.title || 'Sin título')}</td> <!-- TÍTULO en columna Tablero -->
              <td>${task.status}</td>
              <td class="fecha">${formatDate(task.due_date)}</td>
              <td>${escapeHtml(task.assigned_users || 'Sin asignar')}</td>
          </tr>
      `).join('');

      console.log(`${tasks.length} tareas renderizadas`);
  }

    // === CARGAR USUARIOS PARA ASIGNAR CON PERMISOS DE ADMIN ===
    async function loadUsersForAssignment() {
        if (!selectUsuario) return;
        
        try {
            const apiUsuarios = (window.API_BASE && window.API_BASE.trim()) ? 
                window.API_BASE.replace(/\/$/, '') : '/assets/app/endpoints';
            
            const res = await fetch(`${apiUsuarios}/list_users.php`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            
            const json = await res.json();
            console.log("Usuarios para asignar:", json);

            if (json.ok && json.users) {
                // Filtrar solo usuarios activos
                const usuariosActivos = json.users.filter(user => 
                    user.is_active == 1 || user.is_active === "1" || user.is_active === true
                );
                
                const currentUser = window.CURRENT_USER;
                const isAdmin = currentUser && currentUser.is_admin == 1;
                
                console.log('Usuario actual:', currentUser);
                console.log('Es admin:', isAdmin);
                
                selectUsuario.innerHTML = '<option value="">Seleccionar usuario</option>';
                
                if (isAdmin) {
                    // ADMIN: Ver todos los usuarios activos
                    usuariosActivos.forEach(user => {
                        const option = document.createElement('option');
                        option.value = user.id;
                        option.textContent = user.name;
                        selectUsuario.appendChild(option);
                    });
                    console.log(`Admin: ${usuariosActivos.length} usuarios activos cargados`);
                } else {
                    // USUARIO NORMAL: Solo puede asignarse a sí mismo
                    const currentUserActive = usuariosActivos.find(user => 
                        user.id == currentUser.id
                    );
                    
                    if (currentUserActive) {
                        const option = document.createElement('option');
                        option.value = currentUser.id;
                        option.textContent = currentUser.name + ' (Yo)';
                        selectUsuario.appendChild(option);
                        console.log('Usuario normal: Solo puede asignarse a sí mismo');
                    } else {
                        console.warn('Usuario actual no encontrado en usuarios activos');
                        selectUsuario.innerHTML = '<option value="">No disponible</option>';
                    }
                }
            }
        } catch (error) {
            console.error('Error cargando usuarios:', error);
            selectUsuario.innerHTML = '<option value="">Error al cargar usuarios</option>';
        }
    }

  // === FORMULARIO AÑADIR TAREA ===
  formAnadirTarea?.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Evento submit capturado");
    
    // LEER LOS VALORES INMEDIATAMENTE en el evento
    const datosFormulario = {
      titulo: inputTitulo?.value.trim() || '',
      descripcion: inputDescripcion?.value.trim() || '',
      usuarioId: selectUsuario?.value || '',
      estado: selectEstado?.value || 'pendiente',
      prioridad: selectPrioridad?.value || 'media',
      fechaLimite: inputFecha?.value || ''
    };
    
    console.log("Valores capturados EN EL EVENTO:", datosFormulario);
    
    await crearTarea(datosFormulario);
  });

  // --- CREAR NUEVA TAREA ---
  async function crearTarea(datos) {
      console.log("=== INICIO crearTarea ===");
      console.log("Datos recibidos del formulario:", datos);
      
      const { titulo, descripcion, usuarioId, estado, prioridad, fechaLimite } = datos;
      
      // Validaciones
      if (!titulo || titulo.trim() === '') {
          console.error("Validación falló: Título vacío");
          if (typeof configurarAlerta === 'function') {
              configurarAlerta(
                  "Campo requerido",
                  "El título de la tarea es obligatorio",
                  "alerta",
                  { soloAceptar: true }
              );
          }
          return;
      }
      
      console.log("Validaciones pasadas, creando tarea...");
      
      // CONVERTIR ESTADOS Y PRIORIDADES AL FORMATO BACKEND
      const backendStatus = statusToBackend(estado);
      const backendPriority = priorityToBackend(prioridad);
      
      console.log("Valores convertidos:", {
          estadoFrontend: estado,
          estadoBackend: backendStatus,
          prioridadFrontend: prioridad,
          prioridadBackend: backendPriority
      });
      
      const payload = {
          title: titulo,
          description: descripcion || '',
          assigned_to: usuarioId ? parseInt(usuarioId) : null,
          status: backendStatus,  
          priority: backendPriority, 
          due_date: fechaLimite || null
      };
      
      console.log("Paylisto para enviar al backend:", payload);
      
      try {
          const url = `${apiBase}/create_task.php`;
          
          const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          
          const json = await res.json();
          console.log("Respuesta del servidor:", json);
          
        if (json.ok) {
            console.log('Tarea creada exitosamente');
            
            // Limpiar formulario
            formAnadirTarea?.reset();
            if (inputTitulo) inputTitulo.value = '';
            if (inputDescripcion) inputDescripcion.value = '';
            if (selectUsuario) selectUsuario.value = '';
            if (selectEstado) selectEstado.value = 'pending';
            if (selectPrioridad) selectPrioridad.value = 'medium';
            if (inputFecha) inputFecha.value = '';
            
            // Recargar tareas
            await loadTasks();
            
            // DISPARAR EVENTO PARA TABLEROS
            console.log('Disparando evento para Tableros...');
            const eventoTableros = new CustomEvent('tareaCreadaDesdeTareas', {
                detail: {
                    taskId: json.task_id,
                    timestamp: new Date().getTime(),
                    action: 'create',
                    source: 'tasks'
                }
            });
            window.dispatchEvent(eventoTableros);
            console.log("Evento 'tareaCreadaDesdeTareas' disparado");
            
            // Alerta de éxito
            if (typeof configurarAlerta === 'function') {
                configurarAlerta(
                    "Éxito",
                    json.message || "Tarea creada exitosamente",
                    "exito",
                    {
                        soloAceptar: true,
                        onConfirmar: () => {
                            if (typeof mostrarSeccion === 'function') {
                                mostrarSeccion('tareas');
                            }
                        }
                    }
                );
            }
        } else {
              console.error("Error del servidor:", json.message);
              if (typeof configurarAlerta === 'function') {
                  configurarAlerta(
                      "Error",
                      json.message || "No se pudo crear la tarea",
                      "alerta",
                      { soloAceptar: true }
                  );
              }

              // Después de crear una tarea exitosamente
                dispararEventoActualizacionTareas('creacion', {
                    taskId: nuevaTareaId, 
                    action: 'create'
                });
          }
      } catch (error) {
          console.error('Error creando tarea:', error);
          if (typeof configurarAlerta === 'function') {
              configurarAlerta(
                  "Error",
                  "Error de conexión. Intenta nuevamente.",
                  "alerta",
                  { soloAceptar: true }
              );
          }
      }
  }

  // === BOTÓN CANCELAR ===
  btnCancelarTarea?.addEventListener('click', () => {
    console.log("Cancelando creación de tarea");
    
    // Limpiar formulario
    if (formAnadirTarea) formAnadirTarea.reset();
    
    // Regresar a tareas
    if (typeof window.mostrarSeccion === 'function') {
      window.mostrarSeccion('tareas');
    }
  });

  // === BOTÓN AÑADIR TAREA ===
  btnAnadirTarea?.addEventListener('click', () => {
    console.log("Abriendo formulario para añadir tarea");
    
    // Cargar usuarios cada vez que se abre el formulario (por si hay cambios)
    loadUsersForAssignment();
    
    if (typeof window.mostrarSeccion === 'function') {
      window.mostrarSeccion('formulario-tarea');
    }
  });

  // === ELIMINAR TAREAS SELECCIONADAS ===
  btnEliminarSeleccionadas?.addEventListener('click', async () => {
      const tareasSeleccionadas = document.querySelectorAll('.check-cuadro.checked');
      
      if (tareasSeleccionadas.length === 0) {
          mostrarError('No hay tareas seleccionadas');
          return;
      }

      const ids = Array.from(tareasSeleccionadas).map(checkbox => 
          checkbox.getAttribute('data-task-id')
      ).filter(id => id);

      console.log("Tareas a eliminar:", ids);

      if (typeof window.configurarAlerta === 'function') {
          window.configurarAlerta(
              "Eliminar Tareas",
              `¿Estás seguro de eliminar ${ids.length} tarea(s) seleccionada(s)?<br><strong>Las tareas se marcarán como inactivas.</strong>`,
              "alerta",
              {
                  textoConfirmar: "Eliminar",
                  onConfirmar: async () => {
                      await eliminarTareas(ids);
                  },
                  onCancelar: () => {
                      console.log("Eliminación cancelada por el usuario");
                  }
              }
          );
      } else {
          if (confirm(`¿Eliminar ${ids.length} tarea(s)?`)) {
              await eliminarTareas(ids);
          }
      }
  });

    async function eliminarTareas(ids) {
        try {
            console.log("Eliminando tareas:", ids);
            
            const res = await fetch(`${apiBase}/delete_tasks.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task_ids: ids })
            });

            console.log("Respuesta HTTP:", res.status);
            
            if (!res.ok) {
                const errorText = await res.text();
                console.error("Error del servidor:", errorText);
                throw new Error(`HTTP ${res.status}`);
            }

            const json = await res.json();
            console.log("Respuesta del servidor:", json);

            if (json.ok) {
                console.log(`${json.deleted_count || ids.length} tarea(s) eliminada(s)`);
                
                // RECARGAR TAREAS
                await loadTasks();
                actualizarBotonBasura();
                
                // DISPARAR EVENTOS PARA ACTUALIZAR OTRAS SECCIONES
                console.log("Disparando eventos de actualización...");
                
                // Evento para actualizar conteo en Usuarios
                const eventoUsuarios = new CustomEvent('actualizarConteoTareas', {
                    detail: {
                        timestamp: new Date().getTime(),
                        deleted_count: json.deleted_count || ids.length,
                        task_ids: ids
                    }
                });
                window.dispatchEvent(eventoUsuarios);
                console.log("Evento 'actualizarConteoTareas' disparado para users.js");
                
                // Evento para actualizar actividad en Perfil
                const eventoPerfil = new CustomEvent('tareasEliminadas', {
                    detail: {
                        timestamp: new Date().getTime(),
                        deleted_count: json.deleted_count || ids.length,
                        task_ids: ids
                    }
                });
                window.dispatchEvent(eventoPerfil);
                console.log("Evento 'tareasEliminadas' disparado para profile.js");
                
                // Mostrar alerta de éxito
                mostrarExito(json.message || `${ids.length} Tarea(s) eliminada(s) correctamente`);
                
            } else {
                throw new Error(json.message || 'Error al eliminar las tareas');
            }
        } catch (error) {
            console.error('Error eliminando tareas:', error);
            mostrarError(error.message || 'Error de conexión. Intenta nuevamente.');
        }
    }

  // ACTUALIZAR: Función mostrarExito corregida
  function mostrarExito(mensaje) {
      if (typeof window.configurarAlerta === 'function') {
          window.configurarAlerta("Éxito", mensaje, "exito", { 
              soloAceptar: true,
              onConfirmar: () => {
                  console.log("Alerta de éxito cerrada");
              }
          });
      } else {
          alert(mensaje);
      }
  }

  function mostrarError(mensaje) {
      if (typeof window.configurarAlerta === 'function') {
          window.configurarAlerta("Error", mensaje, "alerta", { 
              soloAceptar: true,
              onConfirmar: () => {
                  console.log("Alerta de error cerrada");
              }
          });
      } else {
          alert(mensaje);
      }
  }

  // === CHECKBOXES PARA SELECCIÓN ===
  tbody?.addEventListener('click', (e) => {
    const checkbox = e.target.closest('.check-cuadro');
    if (!checkbox) return;
    
    checkbox.classList.toggle('checked');
    actualizarBotonBasura();
  });

  function actualizarBotonBasura() {
    const seleccionadas = document.querySelectorAll('.check-cuadro.checked').length;
    if (btnEliminarSeleccionadas) {
      btnEliminarSeleccionadas.style.display = seleccionadas > 0 ? 'inline-block' : 'none';
    }
    console.log(`Tareas seleccionadas: ${seleccionadas}`);
  }

  // === FUNCIONES UTILITARIAS ===
  function mostrarExito(mensaje) {
    if (typeof window.configurarAlerta === 'function') {
      window.configurarAlerta("Éxito", mensaje, "exito", { soloAceptar: true });
    } else {
      alert(mensaje);
    }
  }

  function mostrarError(mensaje) {
    if (typeof window.configurarAlerta === 'function') {
      window.configurarAlerta("Error", mensaje, "alerta", { soloAceptar: true });
    } else {
      alert(mensaje);
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // === CARGAR TAREAS ===
  async function loadTasks() {
    try {
      console.log("Cargando tareas...");
      const res = await fetch(`${apiBase}/list_tasks.php`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const json = await res.json();
      console.log("Tareas recibidas:", json);

      // En loadTasks, después de recibir las tareas
      if (json.ok && json.tasks) {
          // CONVERTIR ESTADOS Y PRIORIDADES AL FORMATO FRONTEND
          const tasksWithConvertedStatus = json.tasks.map(task => ({
              ...task,
              status: statusToFrontend(task.status),
              priority: priorityToFrontend(task.priority)
          }));
          
          renderTasks(tasksWithConvertedStatus);
          console.log(` ${tasksWithConvertedStatus.length} tareas cargadas`);
      } else {
        console.error("Error al cargar tareas:", json.message);
        renderTasks([]);
      }
    } catch (error) {
      console.error('Error cargando tareas:', error);
      renderTasks([]);
    }
  }

  // Función mejorada para formato de fecha - LA PAZ, BCS
  function formatDate(dateString) {
      if (!dateString) return '-';
      
      try {
          // Para La Paz, BCS (UTC-7/-6)
          const date = new Date(dateString + 'T12:00:00-07:00');
          
          if (isNaN(date.getTime())) {
              return dateString;
          }
          
          return date.toLocaleDateString('es-MX', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              timeZone: 'America/Mazatlan'
          });
      } catch (error) {
          console.error('Error formateando fecha:', error, dateString);
          return dateString;
      }
  }

  function testConversionesCorregidas() {
      console.log("TEST DE CONVERSIONES CORREGIDAS");
      
      // Test estados - frontend (inglés) a backend (español)
      console.log("--- FRONTEND → BACKEND ---");
      const estadosFrontend = ['pending', 'in_progress', 'completed'];
      estadosFrontend.forEach(estado => {
          const backend = statusToBackend(estado);
          console.log(`Frontend: "${estado}" -> Backend: "${backend}"`);
      });
      
      console.log("--- BACKEND → FRONTEND ---");
      // Test estados - backend (español) a frontend (español formateado)
      const estadosBackend = ['Pendiente', 'En proceso', 'Completado'];
      estadosBackend.forEach(estado => {
          const frontend = statusToFrontend(estado);
          console.log(`Backend: "${estado}" -> Frontend: "${frontend}"`);
      });
      
      console.log("--- PRIORIDADES ---");
      const prioridades = ['low', 'medium', 'high', 'Baja', 'Media', 'Alta'];
      prioridades.forEach(prioridad => {
          const backend = priorityToBackend(prioridad);
          const frontend = priorityToFrontend(backend);
          console.log(`Original: "${prioridad}" -> Backend: "${backend}" -> Frontend: "${frontend}"`);
      });
  }

    // Función para probar permisos de usuario
    function testPermisosUsuario() {
        console.log("TEST DE PERMISOS DE USUARIO");
        
        const currentUser = window.CURRENT_USER;
        if (!currentUser) {
            console.log("No hay usuario en sesión");
            return;
        }
        
        console.log("Usuario actual:", currentUser.name);
        console.log("ID:", currentUser.id);
        console.log("Es admin:", currentUser.is_admin == 1 ? "SÍ" : "NO");
        
        // Verificar qué usuarios vería en el select
        const select = document.getElementById('asignar-a');
        if (select) {
            console.log("Opciones en 'Asignar a':");
            Array.from(select.options).forEach(option => {
                console.log(`   - ${option.value}: ${option.text}`);
            });
        }
    }

    // === ESCUCHAR EVENTOS DE ACTUALIZACIÓN DESDE TABLEROS ===
    window.addEventListener('tareaMovidaEnTableros', async (event) => {
        console.log("EVENTO RECIBIDO: Tarea movida en Tableros", event.detail);
        
        // Recargar tareas inmediatamente
        await loadTasks();
        
        console.log("Tareas actualizadas después de movimiento en Tableros");
    });

    // === ESCUCHAR EVENTOS DE CREACIÓN/ELIMINACIÓN ===
    window.addEventListener('tareaCreadaEnTableros', async (event) => {
        console.log("EVENTO RECIBIDO: Tarea creada en Tableros", event.detail);
        await loadTasks();
    });

    // === ESCUCHAR EVENTOS DE ELIMINACIÓN DESDE TABLEROS ===
    window.addEventListener('tareaEliminadaEnTableros', async (event) => {
        console.log("EVENTO RECIBIDO: Tarea eliminada en Tableros", event.detail);
        
        // Recargar tareas inmediatamente
        await loadTasks();
        
        console.log("Tareas actualizadas después de eliminación en Tableros");
    });

    // === DISPARAR EVENTOS DE ACTUALIZACIÓN ===
    function dispararEventoActualizacionTareas(tipo, detalles = {}) {
        console.log(`Disparando eventos de ${tipo} desde Tareas...`);
        
        const timestamp = new Date().getTime();
        
        // Evento para Tableros (actualizar vista)
        const eventoTableros = new CustomEvent('tareaCreadaDesdeTareas', {
            detail: {
                ...detalles,
                timestamp: timestamp,
                action: 'create',
                source: 'tasks'
            }
        });
        window.dispatchEvent(eventoTableros);
        console.log("Evento 'tareaCreadaDesdeTareas' disparado para boards.js");
        
        // Evento para Perfil (actualizar actividad)
        const eventoPerfil = new CustomEvent('actividadTareaActualizada', {
            detail: {
                ...detalles,
                timestamp: timestamp,
                action: 'create',
                source: 'tasks'
            }
        });
        window.dispatchEvent(eventoPerfil);
        console.log("Evento 'actividadTareaActualizada' disparado para profile.js");
        
        // Evento para Usuarios (actualizar conteos)
        const eventoUsuarios = new CustomEvent('actualizarConteoTareas', {
            detail: {
                timestamp: timestamp,
                action: 'create',
                task_id: detalles.taskId
            }
        });
        window.dispatchEvent(eventoUsuarios);
        console.log("Evento 'actualizarConteoTareas' disparado para users.js");
    }

    console.log("Tasks.js inicializado correctamente");
});