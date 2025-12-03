-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3307
-- Tiempo de generación: 03-12-2025 a las 21:17:39
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `taskcolab`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `entity_type` varchar(50) DEFAULT NULL,
  `entity_id` int(11) DEFAULT NULL,
  `action` varchar(80) DEFAULT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `entity_type`, `entity_id`, `action`, `details`, `created_at`) VALUES
(14, 1, 'task', 3, 'Movió tarea de completado a en proceso', '{\"task_id\":3,\"task_title\":\"Configurar base de datos\",\"from_status\":\"Completado\",\"to_status\":\"En proceso\",\"direction\":\"left\"}', '2025-11-30 17:41:36'),
(15, 1, 'task', 3, 'Movió tarea de en proceso a completado', '{\"task_id\":3,\"task_title\":\"Configurar base de datos\",\"from_status\":\"En proceso\",\"to_status\":\"Completado\",\"direction\":\"right\"}', '2025-11-30 17:42:13'),
(16, 1, 'task', 3, 'Movió tarea de completado a en proceso', '{\"task_id\":3,\"task_title\":\"Configurar base de datos\",\"from_status\":\"Completado\",\"to_status\":\"En proceso\",\"direction\":\"left\"}', '2025-11-30 17:42:19'),
(17, 1, 'task', 2, 'Movió tarea de pendiente a en proceso', '{\"task_id\":2,\"task_title\":\"Implementar API REST\",\"from_status\":\"Pendiente\",\"to_status\":\"En proceso\",\"direction\":\"right\"}', '2025-11-30 17:44:39'),
(18, 2, 'task', 52, 'Movió tarea de pendiente a en proceso', '{\"task_id\":52,\"task_title\":\"Diseñar navbar\",\"from_status\":\"Pendiente\",\"to_status\":\"En proceso\",\"direction\":\"right\"}', '2025-11-30 22:22:02'),
(19, 2, 'task', 52, 'Movió tarea de en proceso a pendiente', '{\"task_id\":52,\"task_title\":\"Diseñar navbar\",\"from_status\":\"En proceso\",\"to_status\":\"Pendiente\",\"direction\":\"left\"}', '2025-11-30 22:48:04'),
(20, 2, 'task', 62, 'Movió tarea de completado a en proceso', '{\"task_id\":62,\"task_title\":\"Diseñar\",\"from_status\":\"Completado\",\"to_status\":\"En proceso\",\"direction\":\"left\"}', '2025-11-30 23:06:58'),
(21, 2, 'task', 61, 'Movió tarea de en proceso a pendiente', '{\"task_id\":61,\"task_title\":\"Flujo\",\"from_status\":\"En proceso\",\"to_status\":\"Pendiente\",\"direction\":\"left\"}', '2025-11-30 23:07:14'),
(22, 2, 'task', 31, 'Movió tarea de pendiente a en proceso', '{\"task_id\":31,\"task_title\":\"Tarea de prueba\",\"from_status\":\"Pendiente\",\"to_status\":\"En proceso\",\"direction\":\"right\"}', '2025-11-30 23:07:30'),
(23, 2, 'task', 31, 'Movió tarea de en proceso a completado', '{\"task_id\":31,\"task_title\":\"Tarea de prueba\",\"from_status\":\"En proceso\",\"to_status\":\"Completado\",\"direction\":\"right\"}', '2025-11-30 23:07:33'),
(24, 2, 'task', 31, 'Movió tarea de completado a en proceso', '{\"task_id\":31,\"task_title\":\"Tarea de prueba\",\"from_status\":\"Completado\",\"to_status\":\"En proceso\",\"direction\":\"left\"}', '2025-11-30 23:08:54'),
(25, 2, 'task', 31, 'Movió tarea de en proceso a completado', '{\"task_id\":31,\"task_title\":\"Tarea de prueba\",\"from_status\":\"En proceso\",\"to_status\":\"Completado\",\"direction\":\"right\"}', '2025-11-30 23:09:00'),
(26, 2, 'task', 61, 'Movió tarea de pendiente a en proceso', '{\"task_id\":61,\"task_title\":\"Flujo\",\"from_status\":\"Pendiente\",\"to_status\":\"En proceso\",\"direction\":\"right\"}', '2025-11-30 23:09:01'),
(27, 2, 'task', 61, 'Movió tarea de en proceso a completado', '{\"task_id\":61,\"task_title\":\"Flujo\",\"from_status\":\"En proceso\",\"to_status\":\"Completado\",\"direction\":\"right\"}', '2025-11-30 23:10:38'),
(28, 2, 'task', 61, 'Movió tarea de completado a en proceso', '{\"task_id\":61,\"task_title\":\"Flujo\",\"from_status\":\"Completado\",\"to_status\":\"En proceso\",\"direction\":\"left\"}', '2025-11-30 23:10:47'),
(29, 2, 'task', 61, 'Movió tarea de en proceso a pendiente', '{\"task_id\":61,\"task_title\":\"Flujo\",\"from_status\":\"En proceso\",\"to_status\":\"Pendiente\",\"direction\":\"left\"}', '2025-11-30 23:10:57'),
(30, 2, 'task', 52, 'Movió tarea de pendiente a en proceso', '{\"task_id\":52,\"task_title\":\"Diseñar navbar\",\"from_status\":\"Pendiente\",\"to_status\":\"En proceso\",\"direction\":\"right\"}', '2025-11-30 23:11:07'),
(31, 2, 'task', 52, 'Movió tarea de en proceso a completado', '{\"task_id\":52,\"task_title\":\"Diseñar navbar\",\"from_status\":\"En proceso\",\"to_status\":\"Completado\",\"direction\":\"right\"}', '2025-11-30 23:11:08'),
(32, 4, 'task', 64, 'Movió tarea de en proceso a pendiente', '{\"task_id\":64,\"task_title\":\"Asegurar\",\"from_status\":\"En proceso\",\"to_status\":\"Pendiente\",\"direction\":\"left\"}', '2025-12-01 14:50:42'),
(33, 4, 'task', 64, 'Movió tarea de pendiente a en proceso', '{\"task_id\":64,\"task_title\":\"Asegurar\",\"from_status\":\"Pendiente\",\"to_status\":\"En proceso\",\"direction\":\"right\"}', '2025-12-01 14:50:57'),
(34, 4, 'task', 64, 'Movió tarea de en proceso a completado', '{\"task_id\":64,\"task_title\":\"Asegurar\",\"from_status\":\"En proceso\",\"to_status\":\"Completado\",\"direction\":\"right\"}', '2025-12-01 14:50:58'),
(35, 4, 'task', 63, 'Movió tarea de en proceso a pendiente', '{\"task_id\":63,\"task_title\":\"Areá de desarrollo\",\"from_status\":\"En proceso\",\"to_status\":\"Pendiente\",\"direction\":\"left\"}', '2025-12-01 15:15:03'),
(36, 4, 'task', 63, 'Movió tarea de pendiente a en proceso', '{\"task_id\":63,\"task_title\":\"Areá de desarrollo\",\"from_status\":\"Pendiente\",\"to_status\":\"En proceso\",\"direction\":\"right\"}', '2025-12-01 15:15:05'),
(37, 4, 'task', 64, 'Movió tarea de completado a en proceso', '{\"task_id\":64,\"task_title\":\"Asegurar\",\"from_status\":\"Completado\",\"to_status\":\"En proceso\",\"direction\":\"left\"}', '2025-12-01 15:15:11'),
(38, 4, 'task', 64, 'Movió tarea de en proceso a pendiente', '{\"task_id\":64,\"task_title\":\"Asegurar\",\"from_status\":\"En proceso\",\"to_status\":\"Pendiente\",\"direction\":\"left\"}', '2025-12-01 15:17:25'),
(39, 4, 'task', 65, 'Movió tarea de en proceso a pendiente', '{\"task_id\":65,\"task_title\":\"Mantener scoreboard\",\"from_status\":\"En proceso\",\"to_status\":\"Pendiente\",\"direction\":\"left\"}', '2025-12-02 14:48:11'),
(40, 4, 'task', 65, 'Movió tarea de pendiente a en proceso', '{\"task_id\":65,\"task_title\":\"Mantener scoreboard\",\"from_status\":\"Pendiente\",\"to_status\":\"En proceso\",\"direction\":\"right\"}', '2025-12-02 14:48:17'),
(41, 4, 'task', 65, 'Movió tarea de en proceso a pendiente', '{\"task_id\":65,\"task_title\":\"Mantener scoreboard\",\"from_status\":\"En proceso\",\"to_status\":\"Pendiente\",\"direction\":\"left\"}', '2025-12-02 17:42:30'),
(42, 4, 'task', 65, 'Movió tarea de pendiente a en proceso', '{\"task_id\":65,\"task_title\":\"Mantener scoreboard\",\"from_status\":\"Pendiente\",\"to_status\":\"En proceso\",\"direction\":\"right\"}', '2025-12-02 17:42:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `attachments`
--

CREATE TABLE `attachments` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `url` text DEFAULT NULL,
  `uploaded_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `boards`
--

CREATE TABLE `boards` (
  `id` int(11) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `visibility` varchar(20) DEFAULT 'private',
  `color` varchar(7) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `boards`
--

INSERT INTO `boards` (`id`, `owner_id`, `title`, `description`, `visibility`, `color`, `created_at`, `updated_at`) VALUES
(1, 1, 'Desarrollo Web', 'Proyecto principal de desarrollo', 'private', '#2196F3', '2025-11-24 00:19:05', '2025-11-24 00:19:05'),
(2, 1, 'Diseño UI/UX', 'Diseños de interfaz', 'private', '#9C27B0', '2025-11-24 00:19:05', '2025-11-24 00:19:05'),
(3, 1, 'Marketing', 'Tareas de marketing', 'private', '#FF9800', '2025-11-24 00:19:05', '2025-11-24 00:19:05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `board_members`
--

CREATE TABLE `board_members` (
  `id` int(11) NOT NULL,
  `board_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `invited_by` int(11) DEFAULT NULL,
  `joined_at` datetime DEFAULT current_timestamp(),
  `role_in_board` varchar(32) DEFAULT 'member'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `edited_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `body` text DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(80) NOT NULL,
  `color` varchar(7) DEFAULT '#E5E7EB'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `board_id` int(11) NOT NULL,
  `title` varchar(250) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('pending','in_progress','done') NOT NULL DEFAULT 'pending',
  `priority` enum('high','medium','low') DEFAULT 'medium',
  `due_date` date DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `position` int(11) DEFAULT 0,
  `column_created` enum('pending','in_progress','done') DEFAULT 'pending',
  `is_active` tinyint(1) DEFAULT 1,
  `tab_id` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tasks`
--

INSERT INTO `tasks` (`id`, `board_id`, `title`, `description`, `status`, `priority`, `due_date`, `created_by`, `created_at`, `updated_at`, `position`, `column_created`, `is_active`, `tab_id`) VALUES
(1, 1, 'Diseñar pantalla de login', 'Crear diseño moderno y responsivo', 'pending', 'high', '2025-12-01', 1, '2025-11-24 00:19:05', '2025-11-24 15:45:56', 0, 'pending', 0, 1),
(2, 1, 'Implementar API REST', 'Endpoints de usuarios y tareas', 'in_progress', 'high', '2025-11-30', 1, '2025-11-24 00:19:05', '2025-11-30 17:44:39', 0, 'in_progress', 1, 1),
(3, 1, 'Configurar base de datos', 'Crear tablas y relaciones', 'in_progress', 'high', '2025-11-20', 1, '2025-11-24 00:19:05', '2025-11-30 17:42:19', 0, 'pending', 1, 1),
(4, 1, 'Testing de integración', 'Probar todos los módulos', 'pending', 'medium', '2025-12-05', 1, '2025-11-24 00:19:05', '2025-12-02 13:14:41', 0, 'pending', 0, 1),
(5, 2, 'Prototipo de dashboard', 'Wireframe del dashboard principal', 'done', 'medium', '2025-11-28', 1, '2025-11-24 00:19:05', '2025-11-29 00:43:08', 0, 'in_progress', 1, 1),
(6, 2, 'Paleta de colores', 'Definir colores de la marca', 'done', 'low', '2025-11-15', 1, '2025-11-24 00:19:05', '2025-11-29 01:42:59', 0, 'pending', 1, 1),
(7, 3, 'Campaña en redes sociales', 'Crear contenido para redes', 'pending', 'medium', '2025-12-10', 1, '2025-11-24 00:19:05', '2025-11-24 15:49:23', 0, 'pending', 0, 1),
(23, 1, 'Tarea de prueba', '123', 'pending', 'medium', '2025-12-06', 1, '2025-11-24 15:45:15', '2025-11-24 15:45:56', 0, 'pending', 0, 1),
(24, 1, 'Hola', '', 'pending', 'medium', '2025-11-24', 1, '2025-11-24 15:46:44', '2025-11-24 15:46:51', 0, 'pending', 0, 1),
(25, 1, 'Diseñar navbar', 'Diseña el navbar', 'pending', 'medium', '2026-01-17', 1, '2025-11-24 19:39:47', '2025-11-24 23:57:31', 0, 'pending', 0, 1),
(26, 1, 'adad', 'asd', 'pending', 'medium', '2025-12-01', 1, '2025-11-24 19:42:48', '2025-11-24 23:57:31', 0, 'pending', 0, 1),
(27, 1, 'Titulo', 'Descripcion', 'pending', 'medium', '2025-11-25', 1, '2025-11-24 20:51:02', '2025-11-24 23:57:31', 0, 'pending', 0, 1),
(28, 1, 'dasas', 'asd', 'pending', 'medium', '2025-12-01', 1, '2025-11-24 20:52:38', '2025-11-24 23:57:31', 0, 'pending', 0, 1),
(29, 1, 'Tarea de prueba', 'Desc', 'pending', 'medium', '2025-12-01', 1, '2025-11-24 21:01:15', '2025-11-24 23:57:31', 0, 'pending', 0, 1),
(30, 1, 'Tarea 1', 'Desc 1', 'pending', 'medium', '2025-12-06', 1, '2025-11-24 21:09:50', '2025-11-24 23:57:31', 0, 'pending', 0, 1),
(31, 1, 'Tarea de prueba', '123', 'done', 'medium', '2025-12-01', 1, '2025-11-24 23:58:52', '2025-11-30 23:09:00', 0, 'pending', 1, 1),
(32, 1, 'Prueba 1', 'Descripcion 1', 'pending', 'medium', '2024-02-12', 1, '2025-11-25 00:31:51', '2025-11-28 23:48:17', 0, 'pending', 0, 1),
(33, 1, 'Prueba Reniery', 'Este es para Reniery', 'pending', 'medium', '2025-12-01', 1, '2025-11-25 00:47:30', '2025-11-27 00:57:08', 0, 'pending', 0, 1),
(34, 1, 'Prueba Reniery 2', 'Este es para Reniery 2', 'pending', 'medium', '2025-12-06', 1, '2025-11-25 00:57:50', '2025-11-27 00:57:08', 0, 'pending', 0, 1),
(35, 1, 'Prueba 3', 'Esta es la desc 3', 'pending', 'medium', '2025-12-05', 1, '2025-11-25 01:06:35', '2025-11-28 23:47:41', 0, 'pending', 0, 1),
(36, 1, 'Prueba 4 Reniery', 'Desc de Prueba 4', 'pending', 'medium', '2026-01-01', 1, '2025-11-25 01:36:21', '2025-11-29 01:43:22', 0, 'pending', 0, 1),
(37, 1, 'Prueba 5', 'Desc prueba 5', 'pending', 'medium', '2026-01-01', 1, '2025-11-25 02:10:39', '2025-11-27 00:41:53', 0, 'pending', 0, 1),
(38, 1, 'Para Keyra', 'Desc de Keyra', 'in_progress', 'medium', '2025-12-04', 1, '2025-11-25 02:11:34', '2025-11-29 00:45:04', 0, 'pending', 0, 1),
(39, 1, 'Prueba 6', '1234', 'pending', 'medium', '2025-12-05', 1, '2025-11-25 02:19:51', '2025-11-29 02:08:49', 0, 'pending', 0, 1),
(40, 1, 'PREUBAA', 'qweqwe', 'pending', 'medium', '2025-12-06', 1, '2025-11-25 02:20:38', '2025-11-27 00:41:25', 0, 'pending', 0, 1),
(41, 1, 'PRUEBA', 'Esta es la prueba', 'pending', 'medium', '2025-11-29', 1, '2025-11-25 02:28:45', '2025-11-26 18:37:19', 0, 'pending', 0, 1),
(42, 1, 'Ultima', 'Ya tengo sueño', 'done', 'high', '2026-01-01', 1, '2025-11-25 02:32:09', '2025-11-26 11:28:28', 0, 'pending', 0, 1),
(43, 1, 'Tarea diagramas de secuencia', 'Crear los diagramas de secuencia de historial de asistencia', 'pending', 'high', '2025-12-05', 2, '2025-11-25 17:41:26', '2025-11-27 00:41:53', 0, 'pending', 0, 1),
(44, 1, 'Tarea de prueba para Mauricio', 'Descripcion Mauricio', 'done', 'low', '2025-12-04', NULL, '2025-11-25 23:35:05', '2025-11-27 00:55:22', 0, 'pending', 0, 1),
(45, 1, 'Segunda prueba', 'Descr prueba 2', 'in_progress', 'high', '2025-12-05', 2, '2025-11-26 00:59:55', '2025-11-26 11:31:21', 0, 'pending', 0, 1),
(46, 1, 'Tarea 3 para Mau', 'Desc Mau 3', 'done', 'high', '2026-01-01', NULL, '2025-11-26 01:02:48', '2025-11-27 00:55:22', 0, 'pending', 0, 1),
(47, 1, 'Diseñar navbar', 'Actualizar los cambios del navbar', 'in_progress', 'high', '2025-12-05', NULL, '2025-11-26 11:26:20', '2025-11-29 02:16:47', 0, 'pending', 1, 1),
(48, 1, 'Cuarta tarea', 'Descripcion cuarta tarea', 'done', 'high', '2025-12-01', 2, '2025-11-26 18:35:36', '2025-11-27 00:41:12', 0, 'pending', 0, 1),
(49, 1, 'Tarea de prueba 3', 'Descripción 3', 'done', 'high', '2026-01-01', 2, '2025-11-27 00:43:25', '2025-11-29 02:14:43', 0, 'pending', 0, 1),
(50, 1, 'Tarea 3 para Keyra', 'Descripcion 3 Keyra', 'in_progress', 'low', '2025-12-05', 1, '2025-11-27 00:56:17', '2025-11-29 10:55:16', 0, 'pending', 0, 1),
(51, 1, 'Mantener scoreboard', 'Dejar implementado el scoreboard', 'in_progress', 'low', '2025-12-01', 1, '2025-11-29 01:51:51', '2025-11-29 01:52:39', 0, 'pending', 0, 1),
(52, 1, 'Diseñar navbar', 'Navabr', 'done', 'medium', '2025-12-06', 2, '2025-11-29 02:15:13', '2025-11-30 23:11:08', 0, 'pending', 1, 1),
(53, 1, 'Servidor', 'Sincronizar la lógica del servidor', 'in_progress', 'low', '2025-11-08', 2, '2025-11-29 10:57:53', '2025-11-29 10:58:13', 0, 'pending', 0, 1),
(54, 1, 'Tarea de Test - 11:11:44', 'Descripción de prueba', 'pending', 'medium', '2025-11-29', 1, '2025-11-29 11:11:44', '2025-11-29 11:13:54', 0, 'pending', 0, 1),
(55, 1, 'Mantenimiento', 'Optimizar el rendimiento del sitio web', 'in_progress', 'low', '2025-12-02', 4, '2025-11-29 11:16:44', '2025-11-29 11:17:05', 0, 'pending', 1, 1),
(56, 1, 'Errores', 'Detectar errores', 'pending', 'medium', '2025-12-05', 4, '2025-11-29 11:28:48', '2025-11-29 11:28:48', 0, 'pending', 1, 1),
(57, 1, 'Gestionar', 'Gestionar a los usuarios', 'in_progress', 'low', '2025-12-06', 1, '2025-11-29 19:43:16', '2025-11-29 19:54:36', 0, 'pending', 1, 1),
(58, 1, 'Etapas', 'Dominar las etapas de desarrollo', 'done', 'low', '2025-12-01', 1, '2025-11-29 19:44:14', '2025-11-29 19:45:37', 0, 'pending', 0, 1),
(59, 1, 'Colaboración', 'Ponerme en comunicación con mi equipo de trabajo', 'in_progress', 'high', '2025-12-04', 4, '2025-11-29 22:38:16', '2025-11-29 22:49:20', 0, 'pending', 0, 1),
(60, 1, 'Gestión de la infraestructura', 'Administración de servidores', 'done', 'low', '2025-12-01', 1, '2025-11-29 22:52:55', '2025-11-29 22:55:18', 0, 'pending', 0, 1),
(61, 1, 'Flujo', 'Visualizar el flujo de la aplicación', 'pending', 'medium', '2025-11-26', 2, '2025-11-30 22:54:22', '2025-11-30 23:10:57', 0, 'pending', 1, 1),
(62, 1, 'Diseñar', 'Diseñar la arquitectura general', 'in_progress', 'low', '2025-10-23', 2, '2025-11-30 23:06:37', '2025-11-30 23:06:58', 0, 'pending', 1, 1),
(63, 1, 'Areá de desarrollo', 'Abarcar los conocimientos en el areá', 'in_progress', 'medium', '2025-11-30', 4, '2025-12-01 14:48:24', '2025-12-01 15:15:05', 0, 'pending', 1, 1),
(64, 1, 'Asegurar', 'Asegurar el funcionamiento correcto del proyecto', 'pending', 'medium', '2025-11-28', 4, '2025-12-01 14:49:46', '2025-12-01 15:17:25', 0, 'pending', 1, 1),
(65, 1, 'Mantener scoreboard', 'Hacer la creación de un scoreboard', 'in_progress', 'medium', '2026-01-10', 4, '2025-12-02 14:47:32', '2025-12-02 17:42:35', 0, 'pending', 1, 1),
(66, 1, 'Admin', 'ADmin', 'in_progress', 'low', '2025-12-31', 4, '2025-12-02 16:00:16', '2025-12-02 16:45:32', 0, 'pending', 0, 1),
(67, 1, 'Gestionar la base de datos', 'Utilizar MySQL', 'in_progress', 'low', '2025-12-17', 4, '2025-12-02 16:15:31', '2025-12-02 16:16:26', 0, 'pending', 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `task_assignments`
--

CREATE TABLE `task_assignments` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `assigned_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `task_assignments`
--

INSERT INTO `task_assignments` (`id`, `task_id`, `user_id`, `assigned_at`) VALUES
(79, 3, 1, '2025-12-02 13:15:46'),
(80, 57, 1, '2025-12-02 13:15:46'),
(81, 2, 1, '2025-12-02 13:15:46'),
(82, 6, 1, '2025-12-02 13:15:46'),
(83, 5, 1, '2025-12-02 13:15:46'),
(128, 3, 4, '2025-12-02 17:41:59'),
(129, 52, 4, '2025-12-02 17:41:59'),
(130, 56, 4, '2025-12-02 17:41:59'),
(131, 55, 4, '2025-12-02 17:41:59'),
(132, 5, 4, '2025-12-02 17:41:59'),
(133, 31, 4, '2025-12-02 17:41:59'),
(134, 62, 2, '2025-12-02 17:42:05'),
(135, 52, 2, '2025-12-02 17:42:05'),
(136, 61, 2, '2025-12-02 17:42:05'),
(137, 31, 2, '2025-12-02 17:42:05'),
(141, 63, 5, '2025-12-02 17:47:56'),
(142, 64, 5, '2025-12-02 17:47:56'),
(143, 3, 5, '2025-12-02 17:47:56'),
(144, 65, 5, '2025-12-02 17:47:56');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `task_tags`
--

CREATE TABLE `task_tags` (
  `task_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `avatar_url` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `last_login` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `is_admin`, `avatar_url`, `notes`, `created_at`, `last_login`, `is_active`) VALUES
(1, 'Reniery Lucero Beltran', 'reniery@gmail.com', '$2y$10$BeYhtsiNOgFW/f4HljI/EeWyDzbFH/x0JG2Te0lv4UY9kvsaqv0tm', 1, '/PROYECTO_GESTOR_TAREAS/assets/uploads/avatars/avatar_1_1763937948.png', 'Buen trabajo', '2025-11-23 15:11:21', '2025-12-02 17:45:25', 1),
(2, 'Keyra Yariely Grijalva', 'keyra@gmail.com', '$2y$10$Xic7QOWUD84jWUpZ44mQYeEWRnY8rHIp4lA6cJOHIMlitnNOqsaCG', 0, '/PROYECTO_GESTOR_TAREAS/assets/uploads/avatars/avatar_2_1764118160.png', 'Destaca mucho', '2025-11-23 15:11:59', '2025-12-02 17:43:50', 1),
(4, 'Carlos Alonso Luquin Lopez', 'luquin@gmail.com', '$2y$10$mg/hyh.XOfHRaIZCJr5a7.h85g9/wXsT/Lz78KXvK9pDX6.6wIUa.', 1, NULL, 'Si trabaja', '2025-11-29 10:51:41', '2025-12-02 17:42:46', 1),
(5, 'Mauricio Hernandez Perez', 'mau@gmail.com', '$2y$10$k5zrZA2yT3Q9Q5WKJgy94.aE05b5NPwHo0ul0fqbQMt.tJEXlN0c.', 0, NULL, 'Excelente', '2025-12-02 13:12:33', '2025-12-02 17:47:56', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_activity_entity` (`entity_type`,`entity_id`);

--
-- Indices de la tabla `attachments`
--
ALTER TABLE `attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uploaded_by` (`uploaded_by`),
  ADD KEY `idx_attachments_task` (`task_id`);

--
-- Indices de la tabla `boards`
--
ALTER TABLE `boards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_boards_owner_id` (`owner_id`);

--
-- Indices de la tabla `board_members`
--
ALTER TABLE `board_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_board_user` (`board_id`,`user_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `invited_by` (`invited_by`);

--
-- Indices de la tabla `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_comments_task` (`task_id`),
  ADD KEY `idx_comments_task_id` (`task_id`);

--
-- Indices de la tabla `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_tasks_board` (`board_id`),
  ADD KEY `idx_tasks_status` (`status`),
  ADD KEY `idx_tasks_due_date` (`due_date`);

--
-- Indices de la tabla `task_assignments`
--
ALTER TABLE `task_assignments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_task_user` (`task_id`,`user_id`),
  ADD KEY `idx_task_assign_task` (`task_id`),
  ADD KEY `idx_task_assign_user` (`user_id`),
  ADD KEY `idx_task_assignments_user_id` (`user_id`);

--
-- Indices de la tabla `task_tags`
--
ALTER TABLE `task_tags`
  ADD PRIMARY KEY (`task_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT de la tabla `attachments`
--
ALTER TABLE `attachments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `boards`
--
ALTER TABLE `boards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `board_members`
--
ALTER TABLE `board_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT de la tabla `task_assignments`
--
ALTER TABLE `task_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=145;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `attachments`
--
ALTER TABLE `attachments`
  ADD CONSTRAINT `attachments_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attachments_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `boards`
--
ALTER TABLE `boards`
  ADD CONSTRAINT `boards_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `board_members`
--
ALTER TABLE `board_members`
  ADD CONSTRAINT `board_members_ibfk_1` FOREIGN KEY (`board_id`) REFERENCES `boards` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `board_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `board_members_ibfk_3` FOREIGN KEY (`invited_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`board_id`) REFERENCES `boards` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `task_assignments`
--
ALTER TABLE `task_assignments`
  ADD CONSTRAINT `task_assignments_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `task_assignments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `task_tags`
--
ALTER TABLE `task_tags`
  ADD CONSTRAINT `task_tags_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `task_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
