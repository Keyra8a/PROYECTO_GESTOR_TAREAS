# 📋 TaskColab

**TaskColab** es un sistema de gestión de tareas colaborativo diseñado para equipos que buscan organizar, asignar y dar seguimiento a sus proyectos de manera eficiente.

---

## 🚀 Características Principales

### 📊 Tableros Kanban
- Visualización de tareas en columnas: **Pendiente**, **En Proceso** y **Completado**
- Creación rápida de tarjetas con información detallada
- Movimiento fluido de tareas entre estados
- Asignación de usuarios y prioridades

### ✅ Gestión de Tareas
- Vista completa de todas las tareas en formato tabla
- Filtrado por estado y usuario asignado
- Eliminación múltiple con checkboxes
- Campos personalizables: título, descripción, prioridad, fecha límite

### 📈 Reportes y Estadísticas
- Exportación de reportes en formato PDF
- Métricas de progreso por tablero
- Análisis de usuarios activos
- Identificación de tareas atrasadas
- Dashboard con estadísticas en tiempo real

### 👥 Administración de Usuarios
- Sistema de roles (Administrador/Usuario)
- Gestión completa de usuarios para administradores
- Asignación de tareas a usuarios específicos
- Notas y comentarios por usuario
- Tracking de actividad y última conexión

### 👤 Perfil de Usuario
- Personalización con avatar/foto de perfil
- Edición de información personal (nombre, correo, contraseña)
- Historial de actividad personal
- Visualización de tareas asignadas

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **PHP 8.4** - Lenguaje del servidor
- **MySQL** (phpMyAdmin) - Base de datos
- **dompdf** - Generación de reportes PDF

### Frontend
- **HTML5** - Estructura
- **CSS3** (Poppins font) - Estilos personalizados
- **JavaScript** (Vanilla) - Interactividad

### Servidor
- **XAMPP** - Entorno de desarrollo local
- **InfinityFree** - Hosting en producción

---

## 📦 Instalación

### Requisitos Previos
- PHP >= 8.4
- MySQL/MariaDB
- Composer
- Servidor web (Apache/Nginx)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/taskcolab.git
   cd taskcolab
   ```

2. **Instalar dependencias**
   ```bash
   composer install
   ```

3. **Configurar la base de datos**
   - Crear una base de datos llamada `taskcolab`
   - Importar el archivo SQL:
   ```bash
   mysql -u tu_usuario -p taskcolab < SQL/taskcolab.sql
   ```

4. **Configurar variables de entorno**
   - Renombrar `.env.example` a `.env` (si existe)
   - Configurar las credenciales de la base de datos en `config/db.php`:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'taskcolab');
   define('DB_USER', 'tu_usuario');
   define('DB_PASS', 'tu_contraseña');
   ```

5. **Iniciar el servidor**
   - **XAMPP**: Colocar el proyecto en `htdocs/` e iniciar Apache y MySQL
   - Acceder a: `http://localhost/taskcolab/`

---

## 📂 Estructura del Proyecto

```
taskcolab/
├── assets/
│   ├── app/                    # Lógica del backend
│   │   ├── endpoints/          # API endpoints
│   │   ├── endpointsPerfil/    # Endpoints de perfil
│   │   ├── endpointsReportes/  # Endpoints de reportes
│   │   ├── endpointsTableros/  # Endpoints de tableros
│   │   └── endpointsTareas/    # Endpoints de tareas
│   ├── controllers/            # Controladores
│   ├── models/                 # Modelos de datos
│   ├── javascript/             # Scripts del frontend
│   ├── styles/                 # Hojas de estilo CSS
│   ├── img/                    # Imágenes y recursos
│   └── uploads/avatars/        # Fotos de perfil de usuarios
├── config/
│   └── db.php                  # Configuración de base de datos
├── SQL/
│   └── taskcolab.sql           # Script de base de datos
├── vendor/                     # Dependencias de Composer
├── view/                       # Vistas HTML
└── index.html                  # Página de inicio
```

---

## 🎯 Uso del Sistema

### Registro e Inicio de Sesión
1. Crear una cuenta desde `registro.html`
2. Marcar "Administrador" si requieres permisos administrativos
3. Iniciar sesión en `login.html`

### Crear Tareas
1. Ir a **Tableros** → Click en el botón **+** de la columna deseada
2. Llenar el formulario:
   - Título de la tarea
   - Descripción detallada
   - Asignar usuarios (checkbox múltiple)
   - Seleccionar prioridad (Alta/Media/Baja)
   - Establecer fecha límite

### Mover Tareas
- Usar los botones de flechas en cada tarjeta para mover entre columnas
- Las tareas se actualizan automáticamente en la vista de **Mis Tareas**

### Generar Reportes
1. Ir a **Reportes**
2. Revisar las métricas y estadísticas
3. Click en **Exportar PDF** para descargar el reporte

### Administrar Usuarios (Solo Administradores)
1. Ir a **Usuarios - Admin**
2. Click en **Añadir Usuario** o editar usuarios existentes
3. Asignar tareas específicas desde la interfaz

---

## 🔐 Roles y Permisos

| Funcionalidad | Usuario | Administrador |
|---------------|---------|---------------|
| Ver tableros | ✅ | ✅ |
| Crear tareas | ✅ | ✅ |
| Editar tareas propias | ✅ | ✅ |
| Ver reportes | ✅ | ✅ |
| Administrar usuarios | ❌ | ✅ |
| Eliminar cualquier usuario | ❌ | ✅ |
| Editar perfil propio | ✅ | ✅ |

---

## 📊 Módulos del Sistema

### 1. Tableros
Visualización tipo Kanban con tres columnas principales. Las tarjetas incluyen:
- Título de la tarea
- Fecha límite
- Usuario asignado
- Nivel de prioridad
- Botones de acción (eliminar, mover)

### 2. Tareas
Tabla completa con todas las tareas mostrando:
- Descripción
- Título del tablero
- Estado actual
- Usuario asignado
- Checkbox para eliminación múltiple

### 3. Reportes
Dashboard con métricas:
- Total de tareas
- Distribución por estado (Pendiente/En Proceso/Completado)
- Progreso por tablero (%)
- Usuarios más activos
- Tareas atrasadas

### 4. Usuarios
Gestión completa de la información de usuarios:
- Nombre completo
- Correo electrónico
- Total de tareas asignadas
- Notas/comentarios
- Estado (Activo/Inactivo)
- Última actualización

### 5. Perfil
Panel personal del usuario:
- Avatar personalizable
- Edición de datos (nombre, correo, contraseña)
- Historial de actividad
- Tareas asignadas
- Opción de eliminación de cuenta

---

## 🤝 Contribuciones

Este es un proyecto académico. Si deseas contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 👥 Equipo de Desarrollo

- **Keyra Yariely Grijalva Ochoa** - Frontend Developer
- **Reniery Lucero Beltrán** - Backend Developer  
- **Zahir Fernando Díaz Barrera** - UI/UX Designer & QA

---

## 📄 Licencia

Este proyecto está bajo la Licencia GPL-3.0 - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 📞 Soporte

Si encuentras algún bug o tienes sugerencias, por favor contacte con el equipo de desarrollo de TaskColab.

---

## 🎓 Proyecto Académico

Este proyecto fue desarrollado como parte de un trabajo académico para demostrar habilidades en:
- Desarrollo web full-stack
- Gestión de bases de datos
- Trabajo colaborativo en equipo
- Metodologías ágiles (Kanban)

---

**Hecho con ❤️ por el equipo TaskColab**
