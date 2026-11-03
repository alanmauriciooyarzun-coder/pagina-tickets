const PRECIO_UNITARIO = 50000;
const DURACION_SORTEO = 10 * 60;
const TIEMPO_AGOTADO = 10;
const CANTIDAD_MINIMA = 1;
const TICKETS_INICIALES = 1000;
const INTERVALO_BOTS = 1000;
const ESPERA_BOTS_MINIMA = 8;
const ESPERA_BOTS_MAXIMA = 20;
const CANTIDAD_BOT_MINIMA = 4;
const CANTIDAD_BOT_MAXIMA = 20;

const PREMIOS_SORTEO = [
  {
    nombre: "Food Truck de 3x2",
    etiqueta: "el Food Truck de 3x2",
    imagen: "./assets/image/food_truck.png",
  },
  {
    nombre: "Carrito de 5 Utilidades",
    etiqueta: "el Carrito de 5 Utilidades",
    imagen: "./assets/image/carrito.png",
  },
  {
    nombre: "$500.000",
    etiqueta: "los $500.000",
    imagen: "./assets/image/dinero.png",
  },
];

const NOMBRES_BOTS = [
  "Juan Pérez",
  "Camila Soto",
  "Matías Rojas",
  "Valentina Díaz",
  "Diego Muñoz",
  "Sofía Herrera",
  "Tomás Vargas",
  "Isidora Castro",
  "Sebastián Fuentes",
  "Martina Silva",
  "Nicolás Araya",
  "Josefa Morales",
  "Benjamín Reyes",
  "Antonia Flores",
  "Vicente Rivas",
  "Florencia Gómez",
  "Joaquín Paredes",
  "Catalina Núñez",
  "Fernanda Lagos",
  "Cristóbal Espinoza",
  "Amanda Vega",
  "Felipe Contreras",
  "Trinidad Salinas",
  "Ignacio Bustos",
  "Constanza Pizarro",
  "Gabriel Miranda",
  "Javiera Bravo",
  "Samuel Cáceres",
  "Emilia Tapia",
  "Lucas Sandoval",
  "Rocío Valenzuela",
  "Agustín Cordero",
  "Magdalena Ortiz",
  "Simón Leal",
  "Paz Torres",
  "Álvaro Guzmán",
  "Renata Sepúlveda",
  "Cristian Espinosa",
  "Daniela Vera",
  "Maximiliano Cifuentes",
  "Carolina Rojas",
  "Andrés Mella",
  "Bárbara Garrido",
  "Fabián Orellana",
  "Laura Carrasco",
  "Rodrigo Henríquez",
  "Paula Saavedra",
  "Esteban Cárdenas",
  "Manuela Escobar",
  "Alejandro Cisternas",
  "Josefina Leiva",
  "Mauricio Sanhueza",
  "Fernanda Toledo",
  "Pablo Villalobos",
  "Tamara Acuña",
  "Cristóbal Donoso",
  "Antonella Farias",
  "Bruno Vergara",
  "Daniela Quezada",
  "Enzo Zambrano",
  "Belén Jara",
  "Nicolás Vásquez",
];

let tickets = TICKETS_INICIALES;
let cantidad = CANTIDAD_MINIMA;
let tiempoRestante = DURACION_SORTEO;
let temporizadorExito = null;
let intervaloBots = null;
let intervaloCountdown = null;
let esperaCompraBot = 0;
let tiempoDesdeCompraBot = 0;
let sorteoFinalizado = false;
let tiempoAgotadoAjustado = false;
let vistaAnteriorParticipantes = null;
let scrollVistaPrincipal = 0;
let compraPendiente = null;
let temporizadorReinicio = null;
let usuarioGanoSorteo = false;
let premioUsuario = null;

const participantes = [];

const formatoMoneda = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const vistaPrincipal = document.querySelector("#vista-principal");
const vistaParticipantes = document.querySelector("#vista-participantes");
const vistaCheckout = document.querySelector("#vista-checkout");
const vistaExito = document.querySelector("#vista-exito");
const vistaDetalles = document.querySelector("#vista-detalles");
const vistaBases = document.querySelector("#vista-bases");
const vistaContacto = document.querySelector("#vista-contacto");
const btnComprarTicket = document.querySelector("#btn-comprar-ticket");
const btnMostrarParticipantes = document.querySelector("#btn-mostrar-participantes");
const btnVolver = document.querySelector("#btn-volver");
const btnVolverParticipantes = document.querySelector("#btn-volver-participantes");
const btnVolverDetalles = document.querySelector("#btn-volver-detalles");
const btnVolverBases = document.querySelector("#btn-volver-bases");
const btnVolverContacto = document.querySelector("#btn-volver-contacto");
const menuPrincipal = document.querySelector("#menu-principal");
const btnMenu = document.querySelector("#btn-menu");
const enlacesNav = document.querySelectorAll("[data-nav]");
const formContacto = document.querySelector("#form-contacto");
const contactoEstado = document.querySelector("#contacto-estado");
const btnSumar = document.querySelector("#btn-sumar");
const btnRestar = document.querySelector("#btn-restar");
const cantidadEl = document.querySelector("#cantidad");
const stockActualEl = document.querySelector("#stock-actual");
const totalPagoEl = document.querySelector("#total-pago");
const countdownEl = document.querySelector("#countdown");
const formulario = document.querySelector("#form-pago");
const titularEl = document.querySelector("#titular");
const fechaEl = document.querySelector("#fecha");
const cvvEl = document.querySelector("#cvv");
const cuerpoParticipantes = document.querySelector("#participantes-body");
const totalParticipantesEl = document.querySelector("#total-participantes");
const ticketsDisponiblesEl = document.querySelector("#tickets-disponibles");
const modalGanadores = document.querySelector("#modal-ganadores");
const btnCerrarSorteo = document.querySelector("#btn-cerrar-sorteo");
const modalPremio = document.querySelector("#modal-premio");
const premioImagen = document.querySelector("#premio-imagen");
const premioMensaje = document.querySelector("#premio-mensaje");
const btnCerrarPremio = document.querySelector("#btn-cerrar-premio");
const modalConfirmarCompra = document.querySelector("#modal-confirmar-compra");
const confirmarCompraTexto = document.querySelector("#confirmar-compra-texto");
const btnCancelarCompra = document.querySelector("#btn-cancelar-compra");
const btnConfirmarCompra = document.querySelector("#btn-confirmar-compra");
const ganadorEls = [
  document.querySelector("#ganador-1"),
  document.querySelector("#ganador-2"),
  document.querySelector("#ganador-3"),
];
const premiosGrid = document.querySelector("#premios-grid");
const detalleImagen = document.querySelector("#detalle-imagen");
const detalleTitulo = document.querySelector("#detalle-titulo");
const detalleDescripcion = document.querySelector("#detalle-descripcion");
let filaVaciaParticipantes = document.querySelector("#participantes-vacio");

function enteroAleatorio(minimo, maximo) {
  return minimo + Math.floor(Math.random() * (maximo - minimo + 1));
}

function actualizarStock() {
  if (stockActualEl) stockActualEl.textContent = tickets;
  if (ticketsDisponiblesEl) ticketsDisponiblesEl.textContent = String(tickets);
}

function actualizarResumen() {
  if (totalPagoEl) totalPagoEl.textContent = formatoMoneda.format(cantidad * PRECIO_UNITARIO);
  if (btnRestar) btnRestar.disabled = cantidad <= CANTIDAD_MINIMA;
  if (btnSumar) btnSumar.disabled = cantidad >= tickets;
  if (cantidadEl && "max" in cantidadEl) cantidadEl.max = String(Math.max(tickets, CANTIDAD_MINIMA));
}

function actualizarCantidad() {
  if (cantidadEl) cantidadEl.value = String(cantidad);
  actualizarResumen();
}

function ajustarCantidadAlStock() {
  cantidad = tickets > 0 ? Math.min(cantidad, tickets) : CANTIDAD_MINIMA;

  if (cantidadEl && document.activeElement === cantidadEl) {
    actualizarResumen();
  } else {
    actualizarCantidad();
  }
}

function normalizarCantidad() {
  const valor = Number.parseInt(cantidadEl?.value ?? "", 10);

  cantidad = Number.isNaN(valor) ? CANTIDAD_MINIMA : Math.max(valor, CANTIDAD_MINIMA);

  if (tickets > 0) cantidad = Math.min(cantidad, tickets);

  actualizarCantidad();
}

function limpiarEstadoParticipantes() {
  vistaAnteriorParticipantes = null;
  btnMostrarParticipantes?.setAttribute("aria-pressed", "false");
}

function guardarScrollVistaPrincipal() {
  if (vistaPrincipal && !vistaPrincipal.classList.contains("hidden")) {
    scrollVistaPrincipal = window.scrollY;
  }
}

function restaurarScrollVistaPrincipal() {
  const destino = scrollVistaPrincipal;

  window.requestAnimationFrame(() => {
    window.scrollTo(0, destino);
  });
}

function ocultarTodasLasVistas() {
  [vistaPrincipal, vistaParticipantes, vistaCheckout, vistaExito, vistaDetalles, vistaBases, vistaContacto].forEach(
    (vista) => vista?.classList.add("hidden")
  );
}

function mostrarVistaPrincipal() {
  ocultarTodasLasVistas();
  if (vistaPrincipal) vistaPrincipal.classList.remove("hidden");
  limpiarEstadoParticipantes();
  marcarNavActivo("inicio");
  restaurarScrollVistaPrincipal();
}

function mostrarVistaParticipantes() {
  guardarScrollVistaPrincipal();

  ocultarTodasLasVistas();
  if (vistaParticipantes) vistaParticipantes.classList.remove("hidden");
  marcarNavActivo("participantes");
  actualizarStock();
}

function mostrarVistaBases() {
  guardarScrollVistaPrincipal();

  ocultarTodasLasVistas();
  if (vistaBases) vistaBases.classList.remove("hidden");
  limpiarEstadoParticipantes();
  marcarNavActivo("bases");
}

function mostrarVistaContacto() {
  guardarScrollVistaPrincipal();

  ocultarTodasLasVistas();
  if (vistaContacto) vistaContacto.classList.remove("hidden");
  limpiarEstadoParticipantes();
  marcarNavActivo("contacto");
}

function obtenerVistaVisible() {
  if (vistaCheckout && !vistaCheckout.classList.contains("hidden")) return vistaCheckout;
  if (vistaExito && !vistaExito.classList.contains("hidden")) return vistaExito;
  if (vistaDetalles && !vistaDetalles.classList.contains("hidden")) return vistaDetalles;
  if (vistaBases && !vistaBases.classList.contains("hidden")) return vistaBases;
  if (vistaContacto && !vistaContacto.classList.contains("hidden")) return vistaContacto;

  return vistaPrincipal;
}

function alternarVistaParticipantes() {
  if (!vistaParticipantes) return;

  if (!vistaParticipantes.classList.contains("hidden")) {
    const destino = vistaAnteriorParticipantes ?? vistaPrincipal;
    const requiereSesion = destino === vistaCheckout && (!window.Auth || !window.Auth.estaAutenticado());

    const destinoFinal = requiereSesion ? vistaPrincipal : destino;

    vistaParticipantes.classList.add("hidden");
    destinoFinal?.classList.remove("hidden");
    vistaAnteriorParticipantes = null;
    btnMostrarParticipantes?.setAttribute("aria-pressed", "false");

    if (destinoFinal === vistaPrincipal) {
      marcarNavActivo("inicio");
      restaurarScrollVistaPrincipal();
    } else if (destinoFinal === vistaBases) {
      marcarNavActivo("bases");
    } else if (destinoFinal === vistaContacto) {
      marcarNavActivo("contacto");
    }
    return;
  }

  vistaAnteriorParticipantes = obtenerVistaVisible();
  mostrarVistaParticipantes();
  btnMostrarParticipantes?.setAttribute("aria-pressed", "true");
}

function marcarNavActivo(destino) {
  if (!menuPrincipal) return;

  menuPrincipal.querySelectorAll("[data-nav]").forEach((enlace) => {
    if (enlace.dataset.nav === destino) {
      enlace.setAttribute("aria-current", "page");
    } else {
      enlace.removeAttribute("aria-current");
    }
  });
}

function cerrarMenuMovil() {
  if (!menuPrincipal) return;

  menuPrincipal.classList.add("hidden");
  menuPrincipal.classList.remove("flex");

  if (btnMenu) {
    btnMenu.setAttribute("aria-expanded", "false");
    btnMenu.setAttribute("aria-label", "Abrir menú");
  }
}

function alternarMenuMovil() {
  if (!menuPrincipal) return;

  const abrir = menuPrincipal.classList.contains("hidden");

  menuPrincipal.classList.toggle("hidden", !abrir);
  menuPrincipal.classList.toggle("flex", abrir);

  if (btnMenu) {
    btnMenu.setAttribute("aria-expanded", String(abrir));
    btnMenu.setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
  }
}

function abrirParticipantesDesdeNav() {
  if (!vistaParticipantes) return;

  if (vistaParticipantes.classList.contains("hidden")) {
    vistaAnteriorParticipantes = obtenerVistaVisible();
    mostrarVistaParticipantes();
  }

  btnMostrarParticipantes?.setAttribute("aria-pressed", "true");
}

function navegarA(destino) {
  cerrarMenuMovil();

  switch (destino) {
    case "premios":
      mostrarVistaPrincipal();
      marcarNavActivo("premios");
      window.requestAnimationFrame(() => {
        document.querySelector("#premios")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      break;
    case "participantes":
      abrirParticipantesDesdeNav();
      break;
    case "bases":
      mostrarVistaBases();
      break;
    case "contacto":
      mostrarVistaContacto();
      break;
    case "inicio":
    default:
      mostrarVistaPrincipal();
      break;
  }
}

function sincronizarTitular() {
  if (!titularEl) return;

  const usuario = window.Auth?.obtenerUsuario?.() ?? null;

  titularEl.readOnly = false;
  titularEl.classList.remove("cursor-not-allowed", "opacity-70");

  if (usuario) {
    if (!titularEl.value.trim()) titularEl.value = usuario.nombre;
  } else {
    titularEl.value = "";
  }
}

function mostrarCheckout() {
  guardarScrollVistaPrincipal();

  ocultarTodasLasVistas();
  if (vistaCheckout) vistaCheckout.classList.remove("hidden");
  limpiarEstadoParticipantes();
  sincronizarTitular();
  actualizarStock();
  actualizarCantidad();
}

function abrirModalConfirmarCompra(cantidadComprada) {
  if (!modalConfirmarCompra) return;

  compraPendiente = cantidadComprada;

  if (confirmarCompraTexto) {
    const sustantivo = cantidadComprada === 1 ? "ticket" : "tickets";
    confirmarCompraTexto.textContent = `¿Estás seguro de comprar ${cantidadComprada} ${sustantivo}?`;
  }

  modalConfirmarCompra.classList.remove("hidden");
  modalConfirmarCompra.classList.add("flex");
  btnConfirmarCompra?.focus();
}

function cerrarModalConfirmarCompra() {
  if (!modalConfirmarCompra) return;

  modalConfirmarCompra.classList.add("hidden");
  modalConfirmarCompra.classList.remove("flex");
  compraPendiente = null;
}

function completarCompra(cantidadComprada) {
  const nombreComprador = (titularEl?.value ?? "").trim() || "Cliente";

  tickets -= cantidadComprada;
  actualizarStock();
  ajustarTiempoPorAgotamiento();
  ajustarCantidadAlStock();
  registrarParticipante(nombreComprador, cantidadComprada);

  if (vistaCheckout) vistaCheckout.classList.add("hidden");
  if (vistaExito) vistaExito.classList.remove("hidden");

  if (temporizadorExito) clearTimeout(temporizadorExito);

  temporizadorExito = setTimeout(() => {
    temporizadorExito = null;

    mostrarVistaPrincipal();

    formulario?.reset();
    sincronizarTitular();
    cantidad = CANTIDAD_MINIMA;
    actualizarCantidad();
    actualizarStock();
  }, 3000);
}

function mostrarDetallesPremio(premio) {
  if (!vistaDetalles || !premio) return;

  if (detalleImagen) {
    detalleImagen.src = premio.imagen;
    detalleImagen.alt = premio.titulo;
  }
  if (detalleTitulo) detalleTitulo.textContent = premio.titulo;
  if (detalleDescripcion) {
    detalleDescripcion.textContent =
      premio.descripcionExtendida || `${premio.descripcion} Descubre todos los detalles de este premio y prepárate para disfrutarlo al máximo.`;
  }

  guardarScrollVistaPrincipal();

  ocultarTodasLasVistas();
  vistaDetalles.classList.remove("hidden");
  limpiarEstadoParticipantes();
}

function formatearTiempo(segundos) {
  const horas = String(Math.floor(segundos / 3600)).padStart(2, "0");
  const minutos = String(Math.floor((segundos % 3600) / 60)).padStart(2, "0");
  const restantes = String(segundos % 60).padStart(2, "0");

  return `${horas}:${minutos}:${restantes}`;
}

function actualizarContadorParticipantes() {
  if (totalParticipantesEl) totalParticipantesEl.textContent = String(participantes.length);
}

function crearFilaVacia() {
  const fila = document.createElement("tr");
  fila.id = "participantes-vacio";

  const celda = document.createElement("td");
  celda.colSpan = 2;
  celda.className = "px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400";
  celda.textContent = "Aún no hay participantes. Las compras aparecerán aquí en tiempo real.";

  fila.appendChild(celda);
  return fila;
}

function crearFilaParticipante(participante) {
  const fila = document.createElement("tr");
  fila.className = "transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50";

  const celdaNombre = document.createElement("td");
  celdaNombre.className = "px-4 py-3 font-medium text-slate-800 dark:text-slate-200";
  celdaNombre.textContent = participante.nombre;

  const celdaTickets = document.createElement("td");
  celdaTickets.className = "px-4 py-3 text-right";

  const badge = document.createElement("span");
  badge.className = "inline-flex min-w-8 items-center justify-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-700 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20";
  badge.textContent = String(participante.tickets);

  celdaTickets.appendChild(badge);
  fila.append(celdaNombre, celdaTickets);
  return fila;
}

function quitarEstadoVacioParticipantes() {
  if (filaVaciaParticipantes) {
    filaVaciaParticipantes.remove();
    filaVaciaParticipantes = null;
  }
}

function registrarParticipante(nombre, cantidadComprada) {
  participantes.push({ nombre, tickets: cantidadComprada });

  quitarEstadoVacioParticipantes();

  if (cuerpoParticipantes) {
    cuerpoParticipantes.appendChild(crearFilaParticipante({ nombre, tickets: cantidadComprada }));
  }

  actualizarContadorParticipantes();
}

function limpiarParticipantes() {
  participantes.length = 0;

  if (cuerpoParticipantes) {
    cuerpoParticipantes.replaceChildren();
    filaVaciaParticipantes = crearFilaVacia();
    cuerpoParticipantes.appendChild(filaVaciaParticipantes);
  } else {
    filaVaciaParticipantes = null;
  }

  actualizarContadorParticipantes();
}

function programarSiguienteCompraBot() {
  esperaCompraBot = enteroAleatorio(ESPERA_BOTS_MINIMA, ESPERA_BOTS_MAXIMA);
  tiempoDesdeCompraBot = 0;
}

function comprarBot() {
  if (sorteoFinalizado || tickets <= 0) return;

  const nombre = NOMBRES_BOTS[enteroAleatorio(0, NOMBRES_BOTS.length - 1)];
  const cantidadBot = Math.min(enteroAleatorio(CANTIDAD_BOT_MINIMA, CANTIDAD_BOT_MAXIMA), tickets);

  tickets -= cantidadBot;
  actualizarStock();
  ajustarTiempoPorAgotamiento();
  ajustarCantidadAlStock();
  registrarParticipante(nombre, cantidadBot);
}

function tickBots() {
  if (sorteoFinalizado) return;

  tiempoDesdeCompraBot += 1;

  if (tiempoDesdeCompraBot < esperaCompraBot) return;

  comprarBot();
  programarSiguienteCompraBot();
}

function detenerBots() {
  if (intervaloBots) {
    clearInterval(intervaloBots);
    intervaloBots = null;
  }
}

function iniciarBots() {
  detenerBots();
  programarSiguienteCompraBot();
  intervaloBots = setInterval(tickBots, INTERVALO_BOTS);
}

function elegirGanadores() {
  let tómbola = [];

  for (const participante of participantes) {
    for (let i = 0; i < participante.tickets; i++) {
      tómbola.push(participante.nombre);
    }
  }

  const ganadores = [];

  while (ganadores.length < 3 && tómbola.length > 0) {
    const indice = enteroAleatorio(0, tómbola.length - 1);
    const ganador = tómbola[indice];
    ganadores.push(ganador);
    tómbola = tómbola.filter((nombre) => nombre !== ganador);
  }

  while (ganadores.length < 3) {
    ganadores.push("Sin participante");
  }

  return ganadores;
}

function mostrarGanadores(ganadores) {
  ganadorEls.forEach((elemento, indice) => {
    if (elemento) elemento.textContent = ganadores[indice] ?? "Sin participante";
  });
}

function normalizarNombre(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function obtenerIndicePremioUsuario(ganadores) {
  const usuario = window.Auth?.obtenerUsuario?.() ?? null;

  if (!usuario) return -1;

  const nombre = normalizarNombre(usuario.nombre);

  return ganadores.findIndex((ganador) => normalizarNombre(ganador) === nombre);
}

function actualizarBotonSorteo(gano) {
  if (!btnCerrarSorteo) return;

  btnCerrarSorteo.textContent = gano ? "Cerrar y reclamar premio" : "Cerrar";
}

function lanzarConfeti() {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  if (document.querySelector("#confeti")) return;

  const canvas = document.createElement("canvas");
  canvas.id = "confeti";
  canvas.className = "pointer-events-none fixed inset-0 z-[60]";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);

  const contexto = canvas.getContext("2d");

  if (!contexto) {
    canvas.remove();
    return;
  }

  const colores = ["#dc2626", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];
  const particulas = Array.from({ length: 180 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.5,
    ancho: 6 + Math.random() * 8,
    alto: 8 + Math.random() * 8,
    velocidadY: 2 + Math.random() * 3.5,
    velocidadX: -1.5 + Math.random() * 3,
    rotacion: Math.random() * Math.PI * 2,
    velocidadRotacion: -0.12 + Math.random() * 0.24,
    color: colores[Math.floor(Math.random() * colores.length)],
  }));

  const inicio = performance.now();
  const duracion = 4500;

  function dibujar(ahora) {
    const transcurrido = ahora - inicio;
    const opacidad = Math.max(0, 1 - transcurrido / duracion);

    contexto.clearRect(0, 0, canvas.width, canvas.height);

    particulas.forEach((particula) => {
      particula.x += particula.velocidadX;
      particula.y += particula.velocidadY;
      particula.rotacion += particula.velocidadRotacion;

      contexto.save();
      contexto.translate(particula.x, particula.y);
      contexto.rotate(particula.rotacion);
      contexto.globalAlpha = opacidad;
      contexto.fillStyle = particula.color;
      contexto.fillRect(-particula.ancho / 2, -particula.alto / 2, particula.ancho, particula.alto);
      contexto.restore();
    });

    if (transcurrido < duracion) {
      requestAnimationFrame(dibujar);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(dibujar);
}

function abrirModalGanadores() {
  if (!modalGanadores) return;

  modalGanadores.classList.remove("hidden");
  modalGanadores.classList.add("flex");
  btnCerrarSorteo?.focus();
}

function cerrarModalGanadores() {
  document.querySelector("#confeti")?.remove();

  if (!modalGanadores) return;

  modalGanadores.classList.add("hidden");
  modalGanadores.classList.remove("flex");
}

function abrirModalPremio() {
  if (!modalPremio || !premioUsuario) return;

  if (premioImagen) {
    premioImagen.src = premioUsuario.imagen;
    premioImagen.alt = premioUsuario.nombre;
  }

  if (premioMensaje) {
    premioMensaje.textContent = `Has ganado ${premioUsuario.etiqueta}, ya está en camino tu premio. Dirígete al apartado de contacto si tienes alguna duda.`;
  }

  modalPremio.classList.remove("hidden");
  modalPremio.classList.add("flex");
  btnCerrarPremio?.focus();
}

function cerrarModalPremio() {
  if (!modalPremio) return;

  modalPremio.classList.add("hidden");
  modalPremio.classList.remove("flex");
}

function programarReinicioSorteo() {
  if (temporizadorReinicio) clearTimeout(temporizadorReinicio);

  temporizadorReinicio = setTimeout(() => {
    temporizadorReinicio = null;
    reiniciarSorteoCompleto();
  }, 5000);
}

function reiniciarSorteoCompleto() {
  cerrarModalGanadores();
  limpiarParticipantes();

  tickets = TICKETS_INICIALES;
  cantidad = CANTIDAD_MINIMA;
  tiempoRestante = DURACION_SORTEO;
  sorteoFinalizado = false;
  tiempoAgotadoAjustado = false;
  usuarioGanoSorteo = false;
  premioUsuario = null;

  if (temporizadorExito) {
    clearTimeout(temporizadorExito);
    temporizadorExito = null;
  }

  if (formulario) formulario.reset();
  sincronizarTitular();

  actualizarStock();
  actualizarCantidad();
  mostrarGanadores(["—", "—", "—"]);
  actualizarBotonSorteo(false);
  mostrarVistaPrincipal();
  iniciarBots();
  iniciarCountdown();
}

function realizarSorteo() {
  const ganadores = elegirGanadores();
  const indicePremio = obtenerIndicePremioUsuario(ganadores);
  const gano = indicePremio !== -1;

  usuarioGanoSorteo = gano;
  premioUsuario = gano ? PREMIOS_SORTEO[indicePremio] ?? null : null;
  mostrarGanadores(ganadores);
  actualizarBotonSorteo(gano);
  abrirModalGanadores();

  if (gano) lanzarConfeti();
}

function finalizarSorteo() {
  if (sorteoFinalizado) return;

  sorteoFinalizado = true;
  detenerBots();
  realizarSorteo();
}

function tickCountdown() {
  if (sorteoFinalizado) return;

  tiempoRestante -= 1;

  if (tiempoRestante <= 0) {
    tiempoRestante = 0;
    if (countdownEl) countdownEl.textContent = formatearTiempo(0);
    finalizarSorteo();
    return;
  }

  if (countdownEl) countdownEl.textContent = formatearTiempo(tiempoRestante);
}

function ajustarTiempoPorAgotamiento() {
  if (tickets > 0 || sorteoFinalizado || tiempoAgotadoAjustado) return;

  tiempoAgotadoAjustado = true;
  tiempoRestante = TIEMPO_AGOTADO;

  if (countdownEl) countdownEl.textContent = formatearTiempo(tiempoRestante);
}

function iniciarCountdown() {
  if (intervaloCountdown) clearInterval(intervaloCountdown);

  if (countdownEl) countdownEl.textContent = formatearTiempo(tiempoRestante);

  intervaloCountdown = setInterval(tickCountdown, 1000);
}

if (btnComprarTicket) {
  btnComprarTicket.addEventListener("click", () => {
    if (!window.Auth || !window.Auth.estaAutenticado()) {
      window.Auth?.abrirModal("login", mostrarCheckout);
      return;
    }

    mostrarCheckout();
  });
}

document.addEventListener("auth:cambio", () => {
  const checkoutVisible = vistaCheckout && !vistaCheckout.classList.contains("hidden");

  if (checkoutVisible) {
    if (!window.Auth?.estaAutenticado?.()) {
      mostrarVistaPrincipal();
      return;
    }

    sincronizarTitular();
  }
});

if (btnMostrarParticipantes) {
  btnMostrarParticipantes.addEventListener("click", alternarVistaParticipantes);
}

if (btnVolver) {
  btnVolver.addEventListener("click", mostrarVistaPrincipal);
}

if (btnVolverParticipantes) {
  btnVolverParticipantes.addEventListener("click", mostrarVistaPrincipal);
}

if (btnVolverDetalles) {
  btnVolverDetalles.addEventListener("click", mostrarVistaPrincipal);
}

if (btnVolverBases) {
  btnVolverBases.addEventListener("click", mostrarVistaPrincipal);
}

if (btnVolverContacto) {
  btnVolverContacto.addEventListener("click", mostrarVistaPrincipal);
}

if (btnMenu) {
  btnMenu.addEventListener("click", alternarMenuMovil);
}

enlacesNav.forEach((enlace) => {
  enlace.addEventListener("click", (evento) => {
    evento.preventDefault();
    navegarA(enlace.dataset.nav);
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) cerrarMenuMovil();
});

if (formContacto) {
  formContacto.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (contactoEstado) {
      contactoEstado.textContent = "¡Gracias por escribirnos! Te responderemos muy pronto.";
      contactoEstado.classList.remove("hidden");
    }

    formContacto.reset();
  });
}

const premiosDetalle = [
  {
    titulo: "Food Truck de 3x2",
    imagen: "./assets/image/food_truck.png",
    descripcion: "Una experiencia gastronómica para compartir con quien quieras.",
    descripcionExtendida:
      "Disfruta de una experiencia gastronómica única en nuestro Food Truck. Válido para ti y dos acompañantes con una selección completa de platillos, bebidas y postres. Ideal para celebrar en grande con amigos o familia.",
  },
  {
    titulo: "Carrito de Compras",
    imagen: "./assets/image/carrito.png",
    descripcion: "Un carrito listo para que te muevas con estilo.",
    descripcionExtendida:
      "Un carrito de compras completo con todo lo necesario para tus compras diarias. Incluye productos seleccionados, organización práctica y gran capacidad para llevar tus compras con total comodidad y estilo.",
  },
  {
    titulo: "$500.000",
    imagen: "./assets/image/dinero.png",
    descripcion: "Un premio en efectivo para celebrar por todo lo alto.",
    descripcionExtendida:
      "Recibe $500.000 en efectivo para usar como tú quieras. Puedes celebrarlo, ahorrar, invertir o darte ese gusto que tanto deseas. Sin restricciones, el premio es completamente tuyo.",
  },
];

if (premiosGrid) {
  premiosGrid.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-action='mas-informacion']");

    if (!boton) return;

    const id = Number.parseInt(boton.dataset.id, 10);

    if (Number.isNaN(id) || !premiosDetalle[id]) return;

    mostrarDetallesPremio(premiosDetalle[id]);
  });
}

if (btnSumar) {
  btnSumar.addEventListener("click", () => {
    if (cantidad < tickets) {
      cantidad += 1;
      actualizarCantidad();
    }
  });
}

if (btnRestar) {
  btnRestar.addEventListener("click", () => {
    cantidad = Math.max(CANTIDAD_MINIMA, cantidad - 1);
    actualizarCantidad();
  });
}

if (cantidadEl) {
  cantidadEl.addEventListener("input", () => {
    const valor = Number.parseInt(cantidadEl.value, 10);

    if (Number.isNaN(valor) || valor < CANTIDAD_MINIMA) return;

    cantidad = Math.min(valor, Math.max(tickets, CANTIDAD_MINIMA));
    actualizarResumen();

    if (valor > tickets) cantidadEl.value = String(cantidad);
  });

  cantidadEl.addEventListener("blur", normalizarCantidad);
}

if (fechaEl) {
  fechaEl.addEventListener("input", () => {
    const digitos = fechaEl.value.replace(/\D/g, "").slice(0, 4);
    fechaEl.value = digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos;
  });
}

if (cvvEl) {
  cvvEl.addEventListener("input", () => {
    cvvEl.value = cvvEl.value.replace(/\D/g, "").slice(0, 3);
  });
}

if (formulario) {
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!window.Auth?.estaAutenticado?.()) {
      if (vistaCheckout) vistaCheckout.classList.add("hidden");
      if (vistaPrincipal) vistaPrincipal.classList.remove("hidden");
      window.Auth?.abrirModal("login", mostrarCheckout);
      return;
    }

    const cantidadIngresada = Number.parseInt(cantidadEl?.value ?? "", 10);

    if (Number.isNaN(cantidadIngresada) || cantidadIngresada < CANTIDAD_MINIMA) {
      alert("Ingresa una cantidad válida de tickets.");
      return;
    }

    cantidad = cantidadIngresada;

    if (cantidad > tickets) {
      alert(`No hay suficientes tickets. Solo quedan ${tickets} disponibles.`);
      return;
    }

    abrirModalConfirmarCompra(cantidad);
  });
}

if (btnCancelarCompra) {
  btnCancelarCompra.addEventListener("click", () => {
    cerrarModalConfirmarCompra();
    cantidadEl?.focus();
    cantidadEl?.select();
  });
}

if (btnConfirmarCompra) {
  btnConfirmarCompra.addEventListener("click", () => {
    if (compraPendiente === null) return;

    const cantidadConfirmada = compraPendiente;
    cerrarModalConfirmarCompra();

    if (cantidadConfirmada > tickets) {
      alert(`No hay suficientes tickets. Solo quedan ${tickets} disponibles.`);
      return;
    }

    completarCompra(cantidadConfirmada);
  });
}

if (modalConfirmarCompra) {
  modalConfirmarCompra.addEventListener("click", (evento) => {
    if (evento.target !== modalConfirmarCompra) return;

    cerrarModalConfirmarCompra();
    cantidadEl?.focus();
    cantidadEl?.select();
  });
}

if (btnCerrarPremio) {
  btnCerrarPremio.addEventListener("click", cerrarModalPremio);
}

if (modalPremio) {
  modalPremio.addEventListener("click", (evento) => {
    if (evento.target === modalPremio) cerrarModalPremio();
  });
}

document.addEventListener("keydown", (evento) => {
  if (evento.key !== "Escape") return;

  if (modalPremio && !modalPremio.classList.contains("hidden")) {
    cerrarModalPremio();
    return;
  }

  if (!modalConfirmarCompra || modalConfirmarCompra.classList.contains("hidden")) return;

  cerrarModalConfirmarCompra();
  cantidadEl?.focus();
  cantidadEl?.select();
});

if (btnCerrarSorteo) {
  btnCerrarSorteo.addEventListener("click", () => {
    const reclamaPremio = usuarioGanoSorteo;

    cerrarModalGanadores();

    if (reclamaPremio) abrirModalPremio();

    programarReinicioSorteo();
  });
}

actualizarStock();
actualizarCantidad();
actualizarContadorParticipantes();
iniciarBots();
iniciarCountdown();
