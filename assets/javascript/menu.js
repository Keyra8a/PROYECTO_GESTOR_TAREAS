// --- Control del menú desplegable en el navbar ---
document.addEventListener("DOMContentLoaded", () => {
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

  dropdownToggles.forEach(toggle => {
    toggle.addEventListener("click", e => {
      e.preventDefault(); // evita que navegue al hacer clic

      const parentDropdown = toggle.parentElement;

      // Cierra todos los dropdowns menos el actual
      document.querySelectorAll(".dropdown").forEach(drop => {
        if (drop !== parentDropdown) drop.classList.remove("active");
      });

      // Alterna el menú del que se hizo clic
      parentDropdown.classList.toggle("active");
    });
  });
});