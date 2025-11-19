<?php
// assets/app/header.php
if (session_status() === PHP_SESSION_NONE) session_start();

$user = $_SESSION['user'] ?? null;
$userName = $user['name'] ?? 'Invitado';
$isAdmin = !empty($user['is_admin']);
$initial = mb_strtoupper(mb_substr($userName, 0, 1, 'UTF-8'));

$imgBase = '../../assets/img';
$homeLink = '../../index.html';
?>
<header class="header">
  <div class="left-section">
    <div class="logo-box-todo">
      <a href="<?php echo $homeLink; ?>"><img src="<?php echo $imgBase; ?>/logo.png" width="30" alt="logo_tareas" class="logo"></a>
    </div>
    <div class="tab-container">
      <h2 class="tab">Pestaña 1</h2>
      <button class="add-tab">+</button>
    </div>
  </div>

  <div class="user-info">
    <h3><?php echo htmlspecialchars($userName, ENT_QUOTES); ?></h3>
    <div class="profile-circle"><?php echo htmlspecialchars($initial, ENT_QUOTES); ?></div>
    <a href="<?php echo $homeLink; ?>"><img src="<?php echo $imgBase; ?>/cerrarsesion.png" alt="cerrar sesión"></a>
  </div>
</header>

<nav class="sidebar">
  <a href="#" data-section="tableros">Tableros <img src="<?php echo $imgBase; ?>/flecha.png"></a>
  <a href="#" data-section="tareas">Tareas <img src="<?php echo $imgBase; ?>/flecha.png"></a>
  <a href="#" data-section="reportes">Reportes <img src="<?php echo $imgBase; ?>/flecha.png"></a>
  <a href="#" data-section="usuarios">Usuarios <img src="<?php echo $imgBase; ?>/flecha.png"></a>
  <a href="#" data-section="perfil">Perfil <img src="<?php echo $imgBase; ?>/flecha.png"></a>
  <a href="#" data-section="inicio" style="display: none !important;"><img src="<?php echo $imgBase; ?>/casita.png" width="30px" height="30px"><img src="<?php echo $imgBase; ?>/flecha.png"></a>

  <?php if ($isAdmin): ?>
    <a href="#" data-section="admin">Admin <img src="<?php echo $imgBase; ?>/flecha.png"></a>
  <?php endif; ?>
  
</nav>
