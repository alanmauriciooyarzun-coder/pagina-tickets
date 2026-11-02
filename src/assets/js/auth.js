const AUTH_CUENTAS_KEY = "cuentas";
const AUTH_SESION_KEY = "sesion";

const modalAuth = document.querySelector("#modal-auth");
const bienvenida = document.querySelector("#bienvenida");
const bienvenidaTexto = document.querySelector("#bienvenida-texto");
const authTitulo = document.querySelector("#auth-titulo");
const btnCerrarAuth = document.querySelector("#btn-cerrar-auth");
const tabLogin = document.querySelector("#tab-login");
const tabRegistro = document.querySelector("#tab-registro");
const formLogin = document.querySelector("#form-login");
const formRegistro = document.querySelector("#form-registro");
const authMensaje = document.querySelector("#auth-mensaje");
const authInvitado = document.querySelector("#auth-invitado");
const authUsuario = document.querySelector("#auth-usuario");
const authNombre = document.querySelector("#auth-nombre");
const btnAbrirLogin = document.querySelector("#btn-abrir-login");
const btnAbrirRegistro = document.querySelector("#btn-abrir-registro");
const btnCerrarSesion = document.querySelector("#btn-cerrar-sesion");
const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector("#login-password");
const registroNombre = document.querySelector("#registro-nombre");
const registroEmail = document.querySelector("#registro-email");
const registroPassword = document.querySelector("#registro-password");
const registroConfirmar = document.querySelector("#registro-confirmar");

const CLASES_TAB_ACTIVA =
  "rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition-colors duration-200 dark:bg-slate-950 dark:text-white";
const CLASES_TAB_INACTIVA =
  "rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition-colors duration-200 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200";

let alExito = null;
let temporizadorBienvenida = null;

function leerCuentas() {
  try {
    const datos = JSON.parse(localStorage.getItem(AUTH_CUENTAS_KEY) ?? "[]");
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

function guardarCuentas(cuentas) {
  localStorage.setItem(AUTH_CUENTAS_KEY, JSON.stringify(cuentas));
}

function hashFnv(texto) {
  let hash = 2166136261;

  for (let i = 0; i < texto.length; i += 1) {
    hash ^= texto.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16);
}

async function hashContrasena(texto) {
  if (window.crypto?.subtle) {
    try {
      const datos = new TextEncoder().encode(texto);
      const buffer = await crypto.subtle.digest("SHA-256", datos);
      const hex = Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");

      return `sha256:${hex}`;
    } catch {
      // Si SubtleCrypto no está disponible se usa el respaldo.
    }
  }

  return `fnv:${hashFnv(texto)}`;
}

function normalizarEmail(email) {
  return email.trim().toLowerCase();
}

function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function obtenerUsuario() {
  const email = localStorage.getItem(AUTH_SESION_KEY);

  if (!email) return null;

  const cuenta = leerCuentas().find((item) => item.email === email);

  if (!cuenta) {
    localStorage.removeItem(AUTH_SESION_KEY);
    return null;
  }

  return { nombre: cuenta.nombre, email: cuenta.email };
}

function estaAutenticado() {
  return obtenerUsuario() !== null;
}

function actualizarInterfazAuth() {
  const usuario = obtenerUsuario();

  if (authInvitado) authInvitado.classList.toggle("hidden", Boolean(usuario));
  if (authUsuario) authUsuario.classList.toggle("hidden", !usuario);
  if (authNombre && usuario) authNombre.textContent = usuario.nombre;
}

function mostrarMensaje(texto) {
  if (!authMensaje) return;

  authMensaje.textContent = texto;
  authMensaje.classList.remove("hidden");
}

function ocultarMensaje() {
  if (!authMensaje) return;

  authMensaje.textContent = "";
  authMensaje.classList.add("hidden");
}

function aplicarModo(modo) {
  const esLogin = modo === "login";

  if (formLogin) formLogin.classList.toggle("hidden", !esLogin);
  if (formRegistro) formRegistro.classList.toggle("hidden", esLogin);
  if (authTitulo) authTitulo.textContent = esLogin ? "Inicia sesión" : "Crea tu cuenta";
  if (tabLogin) {
    tabLogin.className = esLogin ? CLASES_TAB_ACTIVA : CLASES_TAB_INACTIVA;
    tabLogin.setAttribute("aria-selected", String(esLogin));
  }
  if (tabRegistro) {
    tabRegistro.className = esLogin ? CLASES_TAB_INACTIVA : CLASES_TAB_ACTIVA;
    tabRegistro.setAttribute("aria-selected", String(!esLogin));
  }

  ocultarMensaje();

  const primerCampo = esLogin ? loginEmail : registroNombre;
  primerCampo?.focus();
}

function abrirModal(modo = "login", callback = null) {
  alExito = typeof callback === "function" ? callback : null;

  if (modalAuth) {
    modalAuth.classList.remove("hidden");
    modalAuth.classList.add("flex");
  }

  aplicarModo(modo);
}

function cerrarModal() {
  alExito = null;

  if (modalAuth) {
    modalAuth.classList.add("hidden");
    modalAuth.classList.remove("flex");
  }

  ocultarMensaje();
}

function notificarCambio() {
  document.dispatchEvent(
    new CustomEvent("auth:cambio", { detail: { usuario: obtenerUsuario() } })
  );
}

function ocultarBienvenida() {
  if (temporizadorBienvenida) {
    clearTimeout(temporizadorBienvenida);
    temporizadorBienvenida = null;
  }

  if (bienvenida) {
    bienvenida.classList.add("hidden");
    bienvenida.classList.remove("flex");
  }
}

function mostrarBienvenida(nombre) {
  if (!bienvenida) return;

  if (bienvenidaTexto) bienvenidaTexto.textContent = `¡Bienvenido, ${nombre}!`;

  if (temporizadorBienvenida) clearTimeout(temporizadorBienvenida);

  bienvenida.classList.remove("hidden");
  bienvenida.classList.add("flex");

  temporizadorBienvenida = setTimeout(ocultarBienvenida, 3000);
}

function finalizarAuth() {
  const callback = alExito;
  const usuario = obtenerUsuario();

  actualizarInterfazAuth();
  cerrarModal();
  notificarCambio();

  if (usuario) mostrarBienvenida(usuario.nombre);

  if (typeof callback === "function") callback();
}

if (btnAbrirLogin) {
  btnAbrirLogin.addEventListener("click", () => abrirModal("login"));
}

if (btnAbrirRegistro) {
  btnAbrirRegistro.addEventListener("click", () => abrirModal("registro"));
}

if (tabLogin) {
  tabLogin.addEventListener("click", () => aplicarModo("login"));
}

if (tabRegistro) {
  tabRegistro.addEventListener("click", () => aplicarModo("registro"));
}

if (btnCerrarAuth) {
  btnCerrarAuth.addEventListener("click", cerrarModal);
}

if (modalAuth) {
  modalAuth.addEventListener("click", (evento) => {
    if (evento.target === modalAuth) cerrarModal();
  });
}

if (bienvenida) {
  bienvenida.addEventListener("click", ocultarBienvenida);
}

document.addEventListener("keydown", (evento) => {
  if (evento.key !== "Escape") return;

  if (modalAuth && !modalAuth.classList.contains("hidden")) {
    cerrarModal();
  }

  if (bienvenida && !bienvenida.classList.contains("hidden")) {
    ocultarBienvenida();
  }
});

if (btnCerrarSesion) {
  btnCerrarSesion.addEventListener("click", () => {
    localStorage.removeItem(AUTH_SESION_KEY);
    actualizarInterfazAuth();
    notificarCambio();
  });
}

if (formLogin) {
  formLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const email = normalizarEmail(loginEmail?.value ?? "");
    const contrasena = loginPassword?.value ?? "";

    if (!esEmailValido(email) || !contrasena) {
      mostrarMensaje("Ingresa tu correo y contraseña.");
      return;
    }

    const cuenta = leerCuentas().find((item) => item.email === email);

    if (!cuenta) {
      mostrarMensaje("No existe una cuenta con ese correo.");
      return;
    }

    const hash = await hashContrasena(contrasena);

    if (cuenta.contrasena !== hash) {
      mostrarMensaje("La contraseña no es correcta.");
      return;
    }

    localStorage.setItem(AUTH_SESION_KEY, cuenta.email);
    formLogin.reset();
    finalizarAuth();
  });
}

if (formRegistro) {
  formRegistro.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const nombre = (registroNombre?.value ?? "").trim();
    const email = normalizarEmail(registroEmail?.value ?? "");
    const contrasena = registroPassword?.value ?? "";
    const confirmar = registroConfirmar?.value ?? "";

    if (nombre.length < 2) {
      mostrarMensaje("Escribe tu nombre completo.");
      return;
    }

    if (!esEmailValido(email)) {
      mostrarMensaje("Ingresa un correo electrónico válido.");
      return;
    }

    if (contrasena.length < 6) {
      mostrarMensaje("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (contrasena !== confirmar) {
      mostrarMensaje("Las contraseñas no coinciden.");
      return;
    }

    const cuentas = leerCuentas();

    if (cuentas.some((item) => item.email === email)) {
      mostrarMensaje("Ya existe una cuenta con ese correo.");
      return;
    }

    const hash = await hashContrasena(contrasena);

    cuentas.push({ nombre, email, contrasena: hash });
    guardarCuentas(cuentas);
    localStorage.setItem(AUTH_SESION_KEY, email);

    formRegistro.reset();
    finalizarAuth();
  });
}

window.Auth = {
  obtenerUsuario,
  estaAutenticado,
  abrirModal,
  cerrarModal,
};

actualizarInterfazAuth();
