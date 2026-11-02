const THEME_KEY = "tema";

const root = document.documentElement;

function aplicarTema(esOscuro) {
  root.classList.toggle("dark", esOscuro);

  const boton = document.querySelector("#theme-toggle");

  if (boton) {
    boton.setAttribute("aria-pressed", String(esOscuro));
    boton.setAttribute(
      "aria-label",
      esOscuro ? "Cambiar a tema claro" : "Cambiar a tema oscuro"
    );
  }
}

const temaGuardado = localStorage.getItem(THEME_KEY);

aplicarTema(temaGuardado === "oscuro");

document.addEventListener("DOMContentLoaded", () => {
  const boton = document.querySelector("#theme-toggle");

  if (!boton) return;

  boton.addEventListener("click", () => {
    const esOscuro = !root.classList.contains("dark");

    aplicarTema(esOscuro);
    localStorage.setItem(THEME_KEY, esOscuro ? "oscuro" : "claro");
  });

  aplicarTema(root.classList.contains("dark"));
});
