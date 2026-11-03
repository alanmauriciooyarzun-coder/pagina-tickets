# Página de Tickets

Archivo principal del proyecto. Contiene la información general y las reglas que deben respetarse.

## Reglas del proyecto

1. Este archivo (`AGENTS.md`) es la fuente principal de información del proyecto. **Leerlo siempre antes de realizar cualquier tarea.**
2. Mantener este archivo actualizado cada vez que cambie la estructura, la configuración o las reglas del proyecto.
3. El proyecto es HTML con **TailwindCSS 4.x** y usa **modo watch**, por lo que se inicializa con **Node.js**.
4. El CSS fuente de TailwindCSS vive en `src/assets/css/input.css`.
5. TailwindCSS compila con `--watch` hacia `src/assets/css/style.css`.
6. Las carpetas `src/assets/css`, `src/assets/image` y `src/assets/js` están reservadas para los recursos del proyecto. Todo el CSS debe permanecer dentro de `src/assets/css/`.

## Stack

- HTML5
- TailwindCSS 4.x (`tailwindcss` + `@tailwindcss/cli`)
- Node.js LTS (instalado con `nvm`, versión v24.22.1)
- npm

## Estructura del proyecto

```text
Pagina de tickets/
├── AGENTS.md
├── package.json
├── package-lock.json
├── node_modules/
└── src/
    ├── index.html         # Página principal
    └── assets/
        ├── css/
        │   ├── input.css  # CSS fuente de TailwindCSS
        │   └── style.css  # CSS compilado por TailwindCSS (generado)
        ├── image/
        │   ├── logo.png
        │   ├── food_truck.png
        │   ├── carrito.png
        │   └── dinero.png
        └── js/
            ├── prizes.js  # Renderiza dinámicamente las tarjetas de premios
            ├── auth.js    # Cuentas, login/registro y sesión (localStorage)
            ├── tickets.js # SPA de compra, bots, tabla, sorteo y countdown
            └── theme.js   # Alterna el tema claro/oscuro y guarda la preferencia
```

Orden de carga de scripts: `theme.js` en `<head>` (sin `defer`), y `prizes.js`, `auth.js` y `tickets.js` con `defer`, en ese orden. `auth.js` debe cargarse antes de `tickets.js` porque expone `window.Auth`.

## Comandos

> Node se instaló con `nvm`. Si la terminal no reconoce `npm`, ejecutar primero:
> `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"`

- `npm run watch` — compila TailwindCSS y observa cambios (`src/assets/css/input.css` → `src/assets/css/style.css`).
- `npm run build` — compila TailwindCSS minificado para producción.

## Flujo de estilos

1. Escribir clases de TailwindCSS en `src/index.html` (y demás HTML).
2. Escribir estilos personalizados o configuración en `src/assets/css/input.css`.
3. Ejecutar `npm run watch` durante el desarrollo.
4. Incluir `src/assets/css/style.css` desde el HTML con `<link rel="stylesheet" href="./assets/css/style.css">`.

## Tema claro/oscuro

- El tema se controla con la clase `dark` en el elemento `<html>`.
- TailwindCSS usa la estrategia de clase mediante `@custom-variant dark (&:where(.dark, .dark *));` en `src/assets/css/input.css`.
- Usar variantes `dark:` para los estilos del tema oscuro (por ejemplo, `bg-white dark:bg-slate-900`).
- La lógica vive en `src/assets/js/theme.js` y la preferencia se guarda en `localStorage` con la clave `tema` (`"claro"` u `"oscuro"`).
- Tema claro por defecto si no hay preferencia guardada.

## Diseño / UI

- Enfoque **mobile first**: los contenedores usan `w-full mx-auto` con `max-w-7xl` para la página y `max-w-4xl` para la vista de checkout.
- Tipografía y espaciados escalables: `text-3xl md:text-5xl` en el título principal, `p-4 md:p-6` en tarjetas, `px-4 py-8 md:px-8 md:py-12` en el contenido.
- Header/navegación: el `<nav>` principal usa `mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-3 sm:px-6 md:flex-row md:py-4 lg:px-8`. El logo y el menú de texto viven en un `<div>` izquierdo con `flex items-center gap-6` (`md:flex-row`); los botones de autenticación, el tema y el hamburguesa viven en un `<div>` derecho. El menú principal vive en `#menu-principal` (`<div>` con enlaces Inicio, Premios, Participantes, Reglas del Sorteo y Contacto); en escritorio (`md:flex`) aparece junto al logo y en móvil se despliega con el botón hamburguesa `#btn-menu` (`md:hidden`, con `aria-expanded` y `aria-controls`). El enlace activo se marca con `aria-current="page"` y se estiliza con la variante `aria-[current=page]:`.
- Estilo amigable, comercial y enérgico, enfocado en un sorteo de food trucks.
- Fondo del body: `bg-slate-50`; texto principal: `text-slate-800`.
- Prevención de scroll horizontal: `overflow-x-clip` en `body` (no rompe el sticky) y `overflow-x-hidden` en el hero y en la sección de premios.
- Banner del sorteo: fijo arriba (`fixed top-0 h-10 z-40`), por lo que el `body` usa `pt-10`.
- Header: estático en móvil y `md:sticky md:top-10` en escritorio (debajo del banner fijo), con `z-30`.
- Capas: banner `z-40`, header `z-30`, modales (`#modal-ganadores`, `#modal-confirmar-compra`, `#modal-auth`) `z-50`, canvas de confeti `#confeti` `z-[60]` con `pointer-events-none` y modal de premio `#modal-premio` `z-[70]`.
- Acento principal: rojo (`bg-red-600`, `hover:bg-red-700`, `text-white`).
- Botones principales: redondeados (`rounded-xl` o `rounded-full`) con `shadow-md`.
- Panel de checkout: `bg-white rounded-2xl shadow-xl` con borde `border-slate-200`.
- Selector de cantidad: input numérico centrado `#cantidad` (`min=1`, `max=stock`) flanqueado por los botones `#btn-restar` y `#btn-sumar`.
- Grid de premios: estrictamente `grid grid-cols-1 md:grid-cols-3 gap-6`.
- Tarjetas de premios: `bg-white shadow-lg rounded-2xl`, con imagen local superior (`./assets/image/food_truck.png`, `carrito.png`, `dinero.png`) y texto centrado.
- Formulario de pago: una columna apilada (`grid grid-cols-1 gap-4`); Expiración y CVV comparten fila con `grid grid-cols-2 gap-4`. Expiración exige el formato numérico `MM/AA` (`pattern="(0[1-9]|1[0-2])/[0-9]{2}"`) y CVV acepta solo 3 números (`pattern="[0-9]{3}"`, `maxlength="3"`).
- Logo del header: `./assets/image/logo.png` con `h-24 w-auto max-w-full object-contain sm:h-28 md:h-32` (sin clases de fondo detrás de la imagen).
- Tabla de participantes: panel `bg-white rounded-2xl shadow-xl` con tabla responsive (`overflow-x-auto`), filas generadas con `document.createElement` y `textContent` (nunca inyectar nombres sin escapar). Al lado del contador de compras se muestra `#tickets-disponibles`, que refleja el stock restante y se actualiza en tiempo real.
- Modal de ganadores: `fixed inset-0 z-50 hidden items-center justify-center bg-black/70`; al abrir se quita `hidden` y se añade `flex`, y al cerrar se hace lo inverso.
- Botón de cierre del modal de ganadores (`#btn-cerrar-sorteo`): verde (`bg-green-600`, `hover:bg-green-700`) y ancho completo; su texto es «Cerrar» o «Cerrar y reclamar premio» si el usuario con sesión iniciada ganó. Cierra el modal y, tras 5 segundos, reinicia el sorteo completo.
- Modal de premio (`#modal-premio`): `fixed inset-0 z-[70] hidden items-center justify-center bg-black/70`, panel `bg-white rounded-2xl shadow-2xl` con imagen dinámica `#premio-imagen` (`food_truck.png`, `carrito.png` o `dinero.png` según el premio), título grande `#premio-titulo` («¡¡FELICIDADES!!»), mensaje dinámico `#premio-mensaje` («Has ganado …, ya está en camino tu premio. Dirígete al apartado de contacto si tienes alguna duda.») y botón `#btn-cerrar-premio` («Entendido»). Se cierra con el botón, clic en el fondo o `Escape`.
- Footer (`<footer>` después de `</main>`): `border-t` con `bg-white dark:bg-slate-950`, grid `grid-cols-1 md:grid-cols-3` con información de marca, enlaces de navegación (`data-nav`) y datos de contacto; incluye copyright y estilos `dark:`.
- Vistas legales y de contacto: `#vista-bases` y `#vista-contacto` usan `hidden w-full max-w-4xl mx-auto px-4 py-8`, panel `bg-white rounded-2xl shadow-xl` y botones «Volver atrás».
- Header: `#auth-invitado` (botones «Iniciar sesión» y «Crear cuenta») se oculta con `hidden` al iniciar sesión, y `#auth-usuario` («Hola, {nombre}» y «Cerrar sesión») se muestra en su lugar.
- Modal de confirmación de compra `#modal-confirmar-compra`: `fixed inset-0 z-50 hidden items-center justify-center bg-black/70`, con el mensaje dinámico `#confirmar-compra-texto` («¿Estás seguro de comprar X ticket(s)?») y los botones `#btn-cancelar-compra` y `#btn-confirmar-compra`. Se cierra con «Cancelar», clic en el fondo o `Escape`, y al cancelar se vuelve al checkout con la cantidad editable.
- Modal de autenticación `#modal-auth`: `fixed inset-0 z-50 hidden items-center justify-center bg-black/70`, con pestañas `#tab-login`/`#tab-registro`, formularios `#form-login`/`#form-registro` y mensajes en `#auth-mensaje`.
- Overlay de bienvenida `#bienvenida`: `fixed inset-0 z-50 hidden items-center justify-center bg-black/70`, con `#bienvenida-texto` en `text-4xl md:text-6xl`.
- Mantener los estilos `dark:` correspondientes al agregar o modificar componentes.

## Navegación SPA

- `#vista-principal` contiene el hero y el grid de premios; es la vista visible al inicio.
- `#vista-participantes` (`hidden w-full`) contiene el botón «Volver atrás» (`#btn-volver-participantes`) y la tabla de participantes (`#participantes`). Se muestra desde el enlace «Participantes» del menú de navegación (`data-nav="participantes"`) y mantiene las actualizaciones en tiempo real.
- `#vista-checkout` (`hidden w-full max-w-4xl mx-auto px-4 py-8`) contiene el botón «Volver atrás», el panel de stock, el selector de cantidad, el formulario de pago y el botón «Pagar Ticket».
- `#vista-exito` (`hidden text-center`) muestra un check verde en SVG y el mensaje «¡Compra Exitosa!».
- `#vista-bases` (`hidden w-full max-w-4xl mx-auto px-4 py-8`) contiene el texto simulado de bases legales y `#btn-volver-bases`. `#vista-contacto` (mismas clases) contiene el formulario `#form-contacto` y `#btn-volver-contacto`.
- `#btn-comprar-ticket` oculta la vista principal y muestra el checkout; `#btn-volver` hace lo inverso.
- Los enlaces con `data-nav` (menú principal y footer) usan `navegarA()`: «Inicio» y «Premios» muestran `#vista-principal` (Premios además desplaza a `#premios`), «Participantes» muestra `#vista-participantes`, «Reglas del Sorteo» muestra `#vista-bases` y «Contacto» muestra `#vista-contacto`. El menú móvil se cierra al navegar y en `resize` a escritorio.
- Al salir de la vista principal se guarda `window.scrollY` y se restaura al volver a ella, para no perder la posición al regresar de los detalles de un premio, del checkout o de participantes.
- La compra requiere sesión iniciada: sin sesión, `#btn-comprar-ticket` abre `#modal-auth` en modo login y, al autenticarse, continúa al checkout.
- Al enviar `#form-pago` con datos válidos se abre `#modal-confirmar-compra`; «Cancelar» cierra el aviso y devuelve al checkout para ajustar la cantidad, y «Confirmar compra» vuelve a validar el stock y completa la compra.
- Tras un pago exitoso se oculta el checkout, se muestra el éxito y, a los 3 segundos, se vuelve a la vista principal y se reinicia el formulario.
- `#modal-ganadores`, `#modal-confirmar-compra` y `#modal-auth` viven fuera de `main`; el primero se muestra al finalizar el sorteo, el segundo al confirmar una compra y el tercero al iniciar sesión/registrarse.

## Funcionalidad / lógica

- `src/assets/js/tickets.js`:
  - `let tickets = 1000` es el stock global (`TICKETS_INICIALES = 1000`).
  - `PRECIO_UNITARIO = 50000` (COP); el total `#total-pago` se actualiza según la cantidad.
  - El selector usa un input numérico editable `#cantidad` (mínimo `1`, máximo el stock) y los botones `#btn-restar`/`#btn-sumar`.
  - La cantidad puede escribirse directamente; el total se recalcula al instante, se limita al stock al salir del campo y se vuelve a validar al pagar.
  - El panel `#stock-actual` muestra «Stock actual: X disponibles» y se actualiza tras cada compra (real o de un bot). El badge `#tickets-disponibles` de la tabla de participantes usa el mismo stock y se reduce en tiempo real.
  - `#form-pago` usa `preventDefault()`, lee la cantidad escrita, valida el stock y abre `#modal-confirmar-compra` con el mensaje «¿Estás seguro de comprar X ticket(s)?». «Cancelar» cierra el modal y mantiene el checkout abierto; «Confirmar compra» revalida el stock, descuenta los tickets, registra al comprador en la tabla usando el nombre de `#titular` y cambia a `#vista-exito`.
  - Simulación de bots: `NOMBRES_BOTS` contiene 62 nombres. Un `setInterval` de 1 s controla una espera aleatoria de 8 a 20 s entre compras; cada bot compra una cantidad aleatoria e irregular entre 4 y 20 tickets sin superar el stock.
  - `participantes` guarda `{ nombre, tickets }`. `registrarParticipante()` añade una fila a `#participantes-body` con `document.createElement` y actualiza `#total-participantes`.
  - El countdown `#countdown` usa formato `HH:MM:SS`, inicia en `00:10:00` y dura `DURACION_SORTEO = 10 * 60`.
  - Si el stock llega a 0, `ajustarTiempoPorAgotamiento()` fija el reloj en `00:00:10` (una sola vez por sorteo) para finalizar el sorteo.
  - Al llegar a `00:00:00`, `finalizarSorteo()` detiene los bots con `clearInterval`, elige 3 ganadores de `participantes` y abre `#modal-ganadores` con `#ganador-1`, `#ganador-2` y `#ganador-3`. `elegirGanadores()` usa una tómbola proporcional: cada nombre se repite tantas veces como tickets compró; tras sacar un ganador se eliminan todas sus entradas para que no gane dos premios. Si no hay suficientes participantes, completa con «Sin participante».
  - `#btn-cerrar-sorteo` cierra `#modal-ganadores` y programa con `setTimeout` (5 s) `reiniciarSorteoCompleto()`, que limpia `participantes` y la tabla, restaura `tickets = 1000` y `cantidad = 1`, reinicia el reloj a `00:10:00`, vuelve a la vista principal y reinicia bots y countdown (`#modal-premio` permanece abierto hasta que el usuario lo cierre).
  - Si el nombre del usuario con sesión iniciada (`Auth.obtenerUsuario()`, comparado sin acentos ni mayúsculas) está entre los ganadores, el botón cambia a «Cerrar y reclamar premio», se lanza `lanzarConfeti()` (canvas `#confeti` sobre el modal que dibuja partículas durante 4,5 s con `requestAnimationFrame`) y, al reclamar, se abre `#modal-premio` con la imagen y el texto del premio correspondiente (`PREMIOS_SORTEO`). Se respeta `prefers-reduced-motion` y el canvas se elimina al cerrar el modal.
  - El botón `+` se deshabilita al alcanzar el stock y el submit vuelve a validarlo.
  - El nombre de `#titular` se rellena automáticamente desde la sesión si está vacío, pero permanece editable; al cerrar sesión se limpia y se vuelve a la vista principal si el checkout estaba abierto.
  - Los campos `#fecha` y `#cvv` filtran en tiempo real cualquier carácter que no sea numérico; la fecha se formatea como `MM/AA` y el CVV se limita a 3 dígitos.
  - `ocultarTodasLasVistas()` centraliza el ocultamiento de las siete vistas; `navegarA()` atiende los enlaces `[data-nav]`, marca el enlace activo con `aria-current` y cierra el menú móvil. `#btn-menu` alterna `#menu-principal` en móvil.
  - El formulario `#form-contacto` usa `preventDefault()`, muestra un mensaje de confirmación en `#contacto-estado` y se reinicia.

- `src/assets/js/auth.js`:
  - Las cuentas se guardan en `localStorage` con la clave `cuentas` como `[{ nombre, email, contrasena }]`; la contraseña se guarda hasheada (SHA-256 con respaldo FNV-1a).
  - La sesión activa se guarda en `localStorage` con la clave `sesion` (email de la cuenta).
  - Expone `window.Auth` con `obtenerUsuario()`, `estaAutenticado()`, `abrirModal(modo, callback)` y `cerrarModal()`.
  - Emite el evento `auth:cambio` en `document` al iniciar sesión, registrarse o cerrar sesión para que otras partes de la UI reaccionen.
  - Al autenticarse muestra el overlay `#bienvenida` con «¡Bienvenido, {nombre}!» en texto grande durante 3 s; se oculta antes al hacer clic o pulsar `Escape`.
  - Validaciones: nombre mínimo 2 caracteres, email válido, contraseña mínimo 6 caracteres, confirmación igual y email no duplicado.
  - El modal se cierra con el botón `#btn-cerrar-auth`, clic en el fondo o la tecla `Escape`.
