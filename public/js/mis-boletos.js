/* CinePass | Mis boletos.
   Basado en el trabajo de Iván Vladimir: pestañas, tarjeta seleccionable,
   boleto grande, descarga y compartir. Ajustado al diseño conceptual.
   Muestra las reservaciones guardadas en esta pestaña (sessionStorage).
*/
(function () {
  'use strict';
  const API = window.CinePassReserva;
  const $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);

  let filtro = 'activos';
  let seleccionado = params.get('folio') || sessionStorage.getItem(API.CLAVE_ACTUAL);
  const pestanas = Array.from(document.querySelectorAll('[data-filtro]'));

  /* ---------- Utilidades ---------- */
  function icono(nombre) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'icono-cp');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS(ns, 'use');
    use.setAttribute('href', '#cp-' + nombre);
    svg.appendChild(use);
    return svg;
  }

  function el(tag, clase, texto) {
    const e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto !== undefined) e.textContent = texto;
    return e;
  }

  let temporizador;
  function toast(texto, error) {
    const t = $('toast');
    t.textContent = texto;
    t.classList.toggle('error', !!error);
    t.classList.add('visible');
    clearTimeout(temporizador);
    temporizador = setTimeout(() => t.classList.remove('visible'), 3800);
  }

  // "Activos" muestra todo lo vigente (incluye los próximos), como en el concepto.
  function visibles() {
    return API.obtenerReservas().filter(r => {
      const estado = API.estadoReserva(r);
      if (filtro === 'activos') return estado === 'activos' || estado === 'proximos';
      return estado === filtro;
    });
  }

  function pelicula(r) { return API.PELICULAS[r.peliculaId] || API.PELICULAS.sombras; }

  /* ---------- Tarjeta de la lista ---------- */
  function tarjeta(r) {
    const sel = r.folio === seleccionado;
    const estado = API.estadoReserva(r);
    const boton = el('button', 'tarjeta-boleto' + (sel ? ' seleccionada' : ''));
    boton.type = 'button';
    boton.setAttribute('aria-pressed', String(sel));
    boton.setAttribute('aria-label', pelicula(r).nombre + ', ' + API.fechaLegible(r.fechaISO) + ', folio ' + r.folio);

    const img = el('img');
    img.src = pelicula(r).cartel;
    img.alt = '';

    const info = el('div', 'tarjeta-info');
    info.appendChild(el('h3', 'tarjeta-titulo', pelicula(r).nombre));
    const filas = el('ul', 'tarjeta-filas');
    [
      ['calendar', API.fechaLegible(r.fechaISO)],
      ['clock', API.horaLegible(r.hora)],
      ['screen', r.sala],
      ['tag', 'Folio: ' + r.folio]
    ].forEach(([ic, texto]) => {
      const li = el('li');
      li.append(icono(ic), el('span', '', texto));
      filas.appendChild(li);
    });
    info.appendChild(filas);

    const chipCaja = el('div', 'tarjeta-chip');
    let chip;
    if (sel) {
      chip = el('span', 'chip chip-seleccionado');
      const circulo = el('span', 'circulo');
      circulo.appendChild(icono('check'));
      chip.append(circulo, document.createTextNode('Seleccionado'));
    } else if (estado === 'historial') {
      chip = el('span', 'chip chip-historial', r.estado === 'cancelada' ? 'Cancelado' : 'Usado');
    } else {
      chip = el('span', 'chip chip-activo', 'Activo');
    }
    chipCaja.appendChild(chip);

    boton.append(img, info, chipCaja);
    boton.addEventListener('click', () => { seleccionado = r.folio; render(); });
    return boton;
  }

  /* ---------- Boleto grande ---------- */
  function mostrar(r) {
    $('detalle-vacio').hidden = !!r;
    $('detalle-reserva').hidden = !r;
    if (!r) return;
    const partes = API.partesFecha(r.fechaISO);
    $('boleto-cartel').src = pelicula(r).arteBoleto || pelicula(r).cartel;
    $('boleto-dia').textContent = partes.dia;
    $('boleto-fecha').textContent = partes.resto;
    $('boleto-hora').textContent = API.horaLegible(r.hora);
    const numSala = r.sala.replace(/^Sala\s*/i, '');
    $('boleto-sala').replaceChildren(document.createTextNode('Sala '), el('strong', '', numSala));
    $('boleto-asientos').textContent = API.listaAsientos(r.asientos);
    $('boleto-cliente').textContent = r.cliente;
    $('boleto-folio').textContent = r.folio;
    $('qr-caja').innerHTML = API.qrSVG(r);
  }

  function render() {
    const lista = visibles();
    if (!lista.some(r => r.folio === seleccionado)) seleccionado = lista[0] ? lista[0].folio : null;
    $('lista-boletos').replaceChildren(...lista.map(tarjeta));
    $('lista-vacia').hidden = lista.length > 0;
    mostrar(lista.find(r => r.folio === seleccionado));
    pestanas.forEach(p => {
      const activa = p.dataset.filtro === filtro;
      p.classList.toggle('activa', activa);
      p.setAttribute('aria-pressed', String(activa));
    });
  }

  pestanas.forEach(p => p.addEventListener('click', () => { filtro = p.dataset.filtro; render(); }));

  function actual() { return API.obtenerReservas().find(r => r.folio === seleccionado); }

  /* ---------- Descargar boleto (imagen PNG) ---------- */
  function cargarImagen(src) {
    return new Promise((ok, error) => {
      const img = new Image();
      img.onload = () => ok(img);
      img.onerror = error;
      img.src = src;
    });
  }

  function rectRedondo(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  async function dibujarBoleto(r) {
    const W = 860, H = 340, S = 2;
    const canvas = document.createElement('canvas');
    canvas.width = W * S; canvas.height = H * S;
    const ctx = canvas.getContext('2d');
    ctx.scale(S, S);
    try { await document.fonts.ready; } catch (_) {}

    const [cartel, logo] = await Promise.all([cargarImagen(pelicula(r).arteBoleto || pelicula(r).cartel), cargarImagen('img/logo-cinepass-flujo.svg')]);

    // Fondo
    ctx.fillStyle = '#0c1322';
    ctx.fillRect(0, 0, W, H);
    rectRedondo(ctx, 10, 10, W - 20, H - 20, 22);
    const fondo = ctx.createLinearGradient(0, 0, W, 0);
    fondo.addColorStop(0, '#142039'); fondo.addColorStop(1, '#0f1a2d');
    ctx.fillStyle = fondo; ctx.fill();

    // Cartel recortado
    ctx.save();
    rectRedondo(ctx, 10, 10, W - 20, H - 20, 22); ctx.clip();
    const lado = 330, alto = H - 20;
    const escala = Math.max(lado / cartel.width, alto / cartel.height);
    const cw = cartel.width * escala, ch = cartel.height * escala;
    ctx.drawImage(cartel, 10 + (lado - cw) / 2, 10 + (alto - ch) / 2, cw, ch);
    ctx.restore();

    // Logo
    ctx.drawImage(logo, 66, 26, 34, 34);
    ctx.font = '800 26px "Nunito Sans", Arial';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff'; ctx.fillText('Cine', 104, 44);
    ctx.fillStyle = '#ef3f52'; ctx.fillText('Pass', 104 + ctx.measureText('Cine').width, 44);

    // Perforación y borde
    ctx.setLineDash([8, 6]); ctx.strokeStyle = 'rgba(200,209,221,.5)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(340, 14); ctx.lineTo(340, H - 14); ctx.stroke();
    ctx.setLineDash([]);
    rectRedondo(ctx, 10, 10, W - 20, H - 20, 22);
    ctx.strokeStyle = '#c8d1dd'; ctx.stroke();

    // Datos
    const filas = [
      ['Fecha', API.fechaLegible(r.fechaISO)],
      ['Hora', API.horaLegible(r.hora)],
      ['Sala', r.sala],
      ['Asientos', API.listaAsientos(r.asientos)],
      ['Cliente', r.cliente],
      ['Folio', r.folio]
    ];
    filas.forEach(([etiqueta, valor], i) => {
      const y = 56 + i * 45;
      ctx.font = '600 14px "Nunito Sans", Arial'; ctx.fillStyle = '#3fe0b0';
      ctx.fillText(etiqueta.toUpperCase(), 366, y - 10);
      ctx.font = '800 19px "Nunito Sans", Arial'; ctx.fillStyle = '#eef1f6';
      let texto = valor;
      while (ctx.measureText(texto).width > 250 && texto.length > 3) texto = texto.slice(0, -2) + '…';
      ctx.fillText(texto, 366, y + 10);
      if (i < filas.length - 1) {
        ctx.fillStyle = 'rgba(200,209,221,.17)'; ctx.fillRect(366, y + 27, 250, 1);
      }
    });

    // QR
    const qr = API.qrMatriz(r);
    const qx = 640, qy = 70, qt = 180;
    rectRedondo(ctx, qx, qy, qt, qt, 12); ctx.fillStyle = '#fff'; ctx.fill();
    if (qr) {
      const n = qr.getModuleCount(), m = (qt - 24) / n;
      ctx.fillStyle = '#0b0f19';
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
        if (qr.isDark(y, x)) ctx.fillRect(qx + 12 + x * m, qy + 12 + y * m, Math.ceil(m), Math.ceil(m));
      }
    }
    ctx.font = 'italic 14px "Nunito Sans", Arial'; ctx.fillStyle = '#e3e7ee'; ctx.textAlign = 'center';
    ctx.fillText('DEMO · No válido para ingresar', qx + qt / 2, qy + qt + 24);
    ctx.textAlign = 'start';

    return new Promise(ok => canvas.toBlob(ok, 'image/png'));
  }

  $('descargar-boleto').addEventListener('click', async () => {
    const r = actual();
    if (!r) return;
    try {
      const blob = await dibujarBoleto(r);
      const enlace = document.createElement('a');
      enlace.href = URL.createObjectURL(blob);
      enlace.download = 'CinePass_' + r.folio + '.png';
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();
      setTimeout(() => URL.revokeObjectURL(enlace.href), 1500);
      toast('Comprobante de prueba descargado como imagen.');
    } catch (error) {
      console.error(error);
      toast('No se pudo generar la imagen del boleto.', true);
    }
  });

  /* ---------- Compartir ---------- */
  $('compartir-boleto').addEventListener('click', async () => {
    const r = actual();
    if (!r) return;
    const texto = 'Mi boleto de CinePass: ' + pelicula(r).nombre + ' · ' + API.fechaLegible(r.fechaISO) + ' · ' +
      API.horaLegible(r.hora) + ' · ' + r.sala + ' · Asientos ' + API.listaAsientos(r.asientos) + ' · Folio ' + r.folio;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Boleto CinePass', text: texto });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(texto);
        toast('Datos del boleto copiados al portapapeles.');
      } else {
        window.prompt('Copia los datos de tu boleto:', texto);
      }
    } catch (error) {
      if (error.name !== 'AbortError') toast('No se pudo compartir desde este navegador.', true);
    }
  });

  render();
})();
