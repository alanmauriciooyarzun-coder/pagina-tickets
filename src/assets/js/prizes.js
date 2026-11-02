const premios = [
  {
    puesto: "1er Premio",
    titulo: "Food Truck de 3x2",
    descripcion: "Una experiencia gastronómica para compartir con quien quieras.",
    imagen: "./assets/image/food_truck.png",
  },
  {
    puesto: "2do Premio",
    titulo: "Carrito de Compras",
    descripcion: "Un carrito listo para que te muevas con estilo.",
    imagen: "./assets/image/carrito.png",
  },
  {
    puesto: "3er Premio",
    titulo: "$500.000",
    descripcion: "Un premio en efectivo para celebrar por todo lo alto.",
    imagen: "./assets/image/dinero.png",
  },
];

const contenedorPremios = document.querySelector("#premios-grid");

if (contenedorPremios) {
  contenedorPremios.innerHTML = premios
    .map(
      ({ puesto, titulo, descripcion, imagen }, index) => `
        <article class="flex w-full flex-col items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <img
            src="${imagen}"
            alt="${titulo}"
            class="h-44 w-full object-cover md:h-48"
            loading="lazy"
          />
          <div class="w-full p-4 text-center md:p-6">
            <span class="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-700 dark:bg-red-500/20 dark:text-red-300">
              ${puesto}
            </span>
            <h3 class="mt-3 text-lg font-bold text-slate-900 md:text-xl dark:text-white">${titulo}</h3>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">${descripcion}</p>
            <button
              type="button"
              class="mt-2 inline-block text-sm font-semibold text-red-600 hover:underline"
              data-id="${index}"
              data-action="mas-informacion"
            >
              Más información
            </button>
          </div>
        </article>
      `
    )
    .join("");
}
