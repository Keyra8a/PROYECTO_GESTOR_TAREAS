// assets/javascript/users.js
document.addEventListener('DOMContentLoaded', () => {
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

  let usersCache = [];
  let usuarioSeleccionado = null;

  // API base: usa window.API_BASE (set en header.php) o fallback
  const apiBase = (window.API_BASE && window.API_BASE.trim()) ? window.API_BASE.replace(/\/$/, '') : '/assets/app/endpoints';

  // --- Load users ---
  async function loadUsers() {
    try {
      const res = await fetch(`${apiBase}/list_users.php`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.ok) throw new Error(json.message || 'Error al obtener usuarios');
      usersCache = Array.isArray(json.users) ? json.users : [];
      renderTable(usersCache);
    } catch (err) {
      console.error('loadUsers:', err);
      tbody.innerHTML = `<tr><td colspan="4">No se pudieron cargar los usuarios.</td></tr>`;
    }
  }

  // --- Render table ---
  function renderTable(users) {
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!users.length) {
      tbody.innerHTML = `<tr><td colspan="4">No hay usuarios registrados.</td></tr>`;
      return;
    }
    const frag = document.createDocumentFragment();
    users.forEach(u => {
      const tr = document.createElement('tr');
      tr.dataset.id = u.id;
      tr.innerHTML = `
        <td>${escapeHtml(u.name)}</td>
        <td>${escapeHtml(u.email)}</td>
        <td>${typeof u.assigned_count !== 'undefined' ? u.assigned_count : '-'}</td>
        <td>${escapeHtml(u.notes || '')}</td>
      `;
      frag.appendChild(tr);
    });
    tbody.appendChild(frag);
  }

  // --- Delegated click on rows ---
  tbody?.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const id = tr.dataset.id;
    if (!id) return;
    const user = usersCache.find(x => String(x.id) === String(id));
    if (user) {
      abrirDetalle(user);
    } else {
      fetchUsuario(id).then(usr => usr && abrirDetalle(usr));
    }
  });

  function abrirDetalle(user) {
    usuarioSeleccionado = user;
    detalleNombre.textContent = user.name || '';
    detalleCorreo.textContent = user.email || '';
    detalleTareas.textContent = (user.assigned_count !== undefined) ? `${user.assigned_count} tareas` : '0 tareas';
    detalleEstado.textContent = user.is_active == 1 || user.is_active === "1" ? 'Activo' : 'Inactivo';
    detalleFecha.textContent = user.last_login ? formatDate(user.last_login) : 'Sin actividad';

    const current = window.CURRENT_USER || null;
    const esMismoUsuario = current && String(current.id) === String(user.id);

    if (btnEditarDesdeDetalle) btnEditarDesdeDetalle.style.display = esMismoUsuario ? 'inline-block' : 'none';
    if (btnEliminarDesdeDetalle) btnEliminarDesdeDetalle.style.display = esMismoUsuario ? 'inline-block' : 'none';

    if (typeof mostrarSeccion === 'function') mostrarSeccion('detalleUsuario');
    else {
      document.querySelectorAll('.seccion').forEach(s => s.classList.remove('activa'));
      document.getElementById('detalleUsuario')?.classList.add('activa');
    }
  }

  async function fetchUsuario(id) {
    try {
      const res = await fetch(`${apiBase}/get_user.php?id=${encodeURIComponent(id)}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.ok) throw new Error(json.message || 'Error al obtener usuario');
      return json.user;
    } catch (err) {
      console.error('fetchUsuario:', err);
      // Usar alerta personalizada en lugar de alert()
      if (typeof configurarAlerta === 'function') {
        configurarAlerta(
          "Error",
          "No se pudo obtener la información del usuario.",
          "alerta",
          {
            soloAceptar: true,
            onConfirmar: () => {
              if (typeof mostrarSeccion === 'function') mostrarSeccion('usuarios');
            }
          }
        );
      }
      return null;
    }
  }

  // --- Volver ---
  btnVolver?.addEventListener('click', () => {
    if (typeof mostrarSeccion === 'function') mostrarSeccion('usuarios');
    else {
      document.querySelectorAll('.seccion').forEach(s => s.classList.remove('activa'));
      document.getElementById('usuarios')?.classList.add('activa');
    }
  });

  // --- Cancelar editar ---
  btnCancelarEditar?.addEventListener('click', () => {
    if (usuarioSeleccionado) {
      abrirDetalle(usuarioSeleccionado);
    } else {
      if (typeof mostrarSeccion === 'function') mostrarSeccion('usuarios');
      else {
        document.querySelectorAll('.seccion').forEach(s => s.classList.remove('activa'));
        document.getElementById('usuarios')?.classList.add('activa');
      }
    }
  });

  // --- Editar desde detalle (llenar inputs) ---
  btnEditarDesdeDetalle?.addEventListener('click', () => {
    if (!usuarioSeleccionado) return;
    inputEditNombre.value = usuarioSeleccionado.name || '';
    inputEditCorreo.value = usuarioSeleccionado.email || '';
    inputEditTareas.value = usuarioSeleccionado.assigned_count || '0';
    inputEditEstado.value = (usuarioSeleccionado.is_active == 1 || usuarioSeleccionado.is_active === "1") ? '1' : '0';
    inputEditFecha.value = usuarioSeleccionado.last_login ? usuarioSeleccionado.last_login.split(' ')[0] : '';

    if (typeof mostrarSeccion === 'function') mostrarSeccion('editarUsuario');
    else {
      document.querySelectorAll('.seccion').forEach(s => s.classList.remove('activa'));
      document.getElementById('editarUsuario')?.classList.add('activa');
    }
  });

  // --- Guardar edición ---
  btnAceptarEditar?.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!usuarioSeleccionado) {
      if (typeof configurarAlerta === 'function') {
        configurarAlerta(
          "Error",
          "No hay usuario seleccionado para editar.",
          "alerta",
          {
            soloAceptar: true,
            onConfirmar: () => {
              if (typeof mostrarSeccion === 'function') mostrarSeccion('usuarios');
            }
          }
        );
      }
      return;
    }
    const id = usuarioSeleccionado.id;
    if (!id) return;

    // PRIMERO: Mostrar alerta de confirmación
    if (typeof configurarAlerta === 'function') {
      configurarAlerta(
        "Confirmar Cambios",
        "¿Estás seguro de que deseas guardar los cambios realizados?",
        "alerta",
        {
          textoConfirmar: "Confirmar",
          onConfirmar: async () => {
            // Si confirma, entonces hacer el UPDATE
            await guardarCambiosUsuario(id);
          },
          onCancelar: () => {
            // Si cancela, volver a la pantalla de edición
            if (typeof mostrarSeccion === 'function') mostrarSeccion('editarUsuario');
          }
        }
      );
    }
  });

  // --- Función para guardar los cambios (separada) ---
  async function guardarCambiosUsuario(id) {
    const payload = {
      id,
      name: inputEditNombre.value.trim(),
      email: inputEditCorreo.value.trim(),
      notes: usuarioSeleccionado.notes || '', 
      is_active: parseInt(inputEditEstado.value), 
      last_login: inputEditFecha.value || null
    };

    try {
      const res = await fetch(`${apiBase}/update_user.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.ok) {
        // Actualizar el nombre en el header si es el usuario actual
        const current = window.CURRENT_USER;
        if (current && String(current.id) === String(id)) {
          window.CURRENT_USER.name = payload.name;
          window.CURRENT_USER.email = payload.email;
          
          const headerName = document.querySelector('.user-info h3');
          const profileCircle = document.querySelector('.profile-circle');
          if (headerName) {
            headerName.textContent = payload.name;
          }
          if (profileCircle) {
            const initial = payload.name.charAt(0).toUpperCase();
            profileCircle.textContent = initial;
          }
        }

        // Actualizar el usuario en el cache
        const idx = usersCache.findIndex(u => String(u.id) === String(id));
        if (idx !== -1) {
          usersCache[idx] = { ...usersCache[idx], ...json.user };
          usuarioSeleccionado = usersCache[idx];
        }

        await loadUsers();
        
        // SEGUNDO: Mostrar alerta de éxito "Cambios realizados"
        if (typeof configurarAlerta === 'function') {
          configurarAlerta(
            "Cambios Realizados",
            "Usuario actualizado correctamente",
            "exito",
            {
              soloAceptar: true,
              onConfirmar: () => {
                abrirDetalle(usuarioSeleccionado);
              }
            }
          );
        } else {
          abrirDetalle(usuarioSeleccionado);
        }
      } else {
        // Error del servidor
        if (typeof configurarAlerta === 'function') {
          configurarAlerta(
            "Error",
            json.message || 'No se pudo actualizar el usuario',
            "alerta",
            {
              soloAceptar: true,
              onConfirmar: () => {
                if (typeof mostrarSeccion === 'function') mostrarSeccion('editarUsuario');
              }
            }
          );
        }
      }
    } catch (err) {
      console.error('update user:', err);
      if (typeof configurarAlerta === 'function') {
        configurarAlerta(
          "Error",
          "Ocurrió un error al actualizar el usuario. Por favor intenta nuevamente.",
          "alerta",
          {
            soloAceptar: true,
            onConfirmar: () => {
              if (typeof mostrarSeccion === 'function') mostrarSeccion('editarUsuario');
            }
          }
        );
      }
    }
  }

  // --- Eliminar ---
  btnEliminarDesdeDetalle?.addEventListener('click', async () => {
    if (!usuarioSeleccionado) return;
    
    // Usar alerta personalizada para confirmar eliminación
    if (typeof configurarAlerta === 'function') {
      configurarAlerta(
        "Eliminar Usuario",
        `¿Eliminar a <strong>${usuarioSeleccionado.name}</strong>?<br>Esta acción cerrará tu sesión y no se puede deshacer.`,
        "alerta",
        {
          textoConfirmar: "Eliminar",
          onConfirmar: async () => {
            await eliminarUsuario(usuarioSeleccionado.id);
          },
          onCancelar: () => {
            if (typeof mostrarSeccion === 'function') mostrarSeccion('detalleUsuario');
          }
        }
      );
    }
  });

  async function eliminarUsuario(id) {
    try {
      const res = await fetch(`${apiBase}/delete_user.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const json = await res.json();
      
      if (json.ok) {
        // Mostrar alerta de éxito y redirigir
        if (typeof configurarAlerta === 'function') {
          configurarAlerta(
            "Usuario Eliminado",
            "Usuario eliminado correctamente.<br>Serás redirigido al login.",
            "exito",
            {
              soloAceptar: true,
              onConfirmar: () => {
                window.location.href = '../../view/login.html';
              }
            }
          );
        } else {
          // Fallback si no existe configurarAlerta
          window.location.href = '../../view/login.html';
        }
      } else {
        // Error del servidor
        if (typeof configurarAlerta === 'function') {
          configurarAlerta(
            "Error",
            json.message || 'No se pudo eliminar el usuario',
            "alerta",
            {
              soloAceptar: true,
              onConfirmar: () => {
                if (typeof mostrarSeccion === 'function') mostrarSeccion('detalleUsuario');
              }
            }
          );
        }
      }
    } catch (err) {
      console.error('delete user:', err);
      if (typeof configurarAlerta === 'function') {
        configurarAlerta(
          "Error",
          "Ocurrió un error al eliminar el usuario. Por favor intenta nuevamente.",
          "alerta",
          {
            soloAceptar: true,
            onConfirmar: () => {
              if (typeof mostrarSeccion === 'function') mostrarSeccion('detalleUsuario');
            }
          }
        );
      }
    }
  }

  // Helpers
  function escapeHtml(str = '') {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(d) {
    if (!d) return '';
    const date = new Date(d);
    if (isNaN(date)) return d;
    return date.toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  }

  // Init
  loadUsers();
});