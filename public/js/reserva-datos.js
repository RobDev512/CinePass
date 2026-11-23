/* CinePass | Datos y utilidades del flujo de reservación.
   Basado en el trabajo de Iván Vladimir (rama-ivan) y ajustado al diseño conceptual.

   IMPORTANTE: todavía no hay API ni base de datos.
   - Las reservaciones se guardan en sessionStorage (solo en esta pestaña).
   - Las funciones ficticias tienen fechas relativas al día actual para que
     los filtros Activos / Próximos / Historial no muestren fechas vencidas como futuras.

   Contrato provisional con la pantalla de Asientos (Lance):
   confirmacion.html?pelicula=sombras&funcion=demo-01&asientos=D5,D6
   Nunca pasar nombre, correo ni teléfono por URL.
*/
(function () {
  'use strict';

  const CLAVE_RESERVAS = 'cinepass_reservas_v3_claude';
  const CLAVE_ACTUAL = 'cinepass_reserva_actual_v3_claude';
  const HOY_DEMO = new Date();
  function fechaRelativa(dias) {
    const f = new Date();
    f.setHours(12, 0, 0, 0);
    f.setDate(f.getDate() + dias);
    return [f.getFullYear(), String(f.getMonth() + 1).padStart(2, '0'), String(f.getDate()).padStart(2, '0')].join('-');
  }

  // Una fuente de verdad: nombre, duración, género, cartel y precio del catálogo.
  // La fase DEMO reserva solo Sombras del Faro; las otras 5 esperan a Lance.
  const ficha = window.CinePassCatalogo && window.CinePassCatalogo.porId.sombras;
  if (!ficha) throw new Error('Falta cargar js/catalogo-demo.js antes de reserva-datos.js');
  const PELICULAS = {
    sombras: Object.freeze({
      ...ficha,
      genero: ficha.generoDetalle || ficha.genero,
      calificacion: ficha.calificacion,
      votos: ficha.votos,
      precioBoleto: ficha.precioBoleto
    })
  };

  const FUNCIONES = {
    'demo-01': { id: 'demo-01', peliculaId: 'sombras', fechaISO: fechaRelativa(2), hora: '19:30', sala: 'Sala 3' },
    'demo-02': { id: 'demo-02', peliculaId: 'sombras', fechaISO: fechaRelativa(6), hora: '17:10', sala: 'Sala 3' },
    'demo-00': { id: 'demo-00', peliculaId: 'sombras', fechaISO: fechaRelativa(-4), hora: '20:00', sala: 'Sala 1' }
  };

  // Reservaciones de ejemplo que se muestran la primera vez (como en el concepto).
  const SEMILLA = [
    { folio: 'CP-2026-1148', funcionId: 'demo-01', asientos: ['D5', 'D6'], cliente: 'Alex García (ejemplo)', estado: 'confirmada' },
    { folio: 'CP-2026-1097', funcionId: 'demo-02', asientos: ['F7', 'F8'], cliente: 'Alex García (ejemplo)', estado: 'confirmada' },
    { folio: 'CP-2026-0983', funcionId: 'demo-00', asientos: ['C3'], cliente: 'Alex García (ejemplo)', estado: 'usada' }
  ];

  /* ---------- Formatos ---------- */
  const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  function fechaDesdeISO(iso, hora) {
    const [y, m, d] = iso.split('-').map(Number);
    const [h, min] = (hora || '12:00').split(':').map(Number);
    return new Date(y, m - 1, d, h, min);
  }

  // "Sáb 21 Nov 2026" → { dia: 'Sáb', resto: '21 Nov 2026' }
  function partesFecha(iso) {
    const f = fechaDesdeISO(iso);
    return { dia: DIAS[f.getDay()], resto: f.getDate() + ' ' + MESES[f.getMonth()] + ' ' + f.getFullYear() };
  }
  function fechaLegible(iso) { const p = partesFecha(iso); return p.dia + ' ' + p.resto; }

  // "19:30" → "7:30 p. m."
  function horaLegible(hora) {
    const [h, m] = hora.split(':').map(Number);
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ':' + String(m).padStart(2, '0') + (h < 12 ? ' a. m.' : ' p. m.');
  }

  function dinero(cantidad) {
    return '$' + new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 }).format(cantidad) + ' MXN';
  }

  function listaAsientos(asientos) {
    if (asientos.length <= 1) return asientos.join('');
    return asientos.slice(0, -1).join(', ') + ' y ' + asientos[asientos.length - 1];
  }

  /* ---------- Contexto de la confirmación ---------- */
  const ASIENTO_VALIDO = /^(?:[A-H](?:10|[1-9]))$/;

  function leerContexto() {
    const p = new URLSearchParams(location.search);
    const funcion = FUNCIONES[p.get('funcion')] || FUNCIONES['demo-01'];
    const pelicula = PELICULAS[funcion.peliculaId]; // No mezclar película y función si la URL trae datos incompatibles.
    const textoAsientos = p.get('asientos') === null ? 'D5,D6' : p.get('asientos');
    const asientos = [...new Set(textoAsientos.split(',')
      .map(s => s.trim().toUpperCase())
      .filter(s => ASIENTO_VALIDO.test(s)))].slice(0, 6);
    return { pelicula, funcion, asientos, precio: pelicula.precioBoleto, total: asientos.length * pelicula.precioBoleto };
  }

  /* ---------- Almacenamiento (sessionStorage) ---------- */
  function completar(r) {
    const funcion = FUNCIONES[r.funcionId] || FUNCIONES['demo-01'];
    return Object.assign({
      peliculaId: funcion.peliculaId,
      fechaISO: funcion.fechaISO,
      hora: funcion.hora,
      sala: funcion.sala,
      precioBoleto: PELICULAS[funcion.peliculaId].precioBoleto,
      ejemplo: true
    }, r);
  }

  function leerCrudo() {
    try {
      const valor = JSON.parse(sessionStorage.getItem(CLAVE_RESERVAS));
      return Array.isArray(valor) ? valor : null;
    } catch (_) { return null; }
  }

  function guardarLista(lista) {
    try { sessionStorage.setItem(CLAVE_RESERVAS, JSON.stringify(lista.slice(0, 30))); return true; }
    catch (error) { console.error('No se pudo guardar en sessionStorage:', error); return false; }
  }

  function obtenerReservas() {
    let lista = leerCrudo();
    if (!lista) {
      lista = SEMILLA.map(completar);
      guardarLista(lista);
    }
    return lista.filter(r => r && typeof r.folio === 'string' && Array.isArray(r.asientos));
  }

  function guardarReserva(reserva) {
    const lista = obtenerReservas();
    lista.unshift(reserva);
    const ok = guardarLista(lista);
    if (ok) { try { sessionStorage.setItem(CLAVE_ACTUAL, reserva.folio); } catch (_) {} }
    return ok;
  }

  function choqueDeAsientos(funcionId, asientos) {
    return obtenerReservas().some(r => r.estado === 'confirmada' && !r.ejemplo && r.funcionId === funcionId &&
      r.asientos.some(a => asientos.includes(a)));
  }

  function folioNuevo() {
    const usados = new Set(obtenerReservas().map(r => r.folio));
    let folio;
    do { folio = 'CP-DEMO-' + Math.random().toString(36).slice(2, 8).toUpperCase(); } while (usados.has(folio));
    return folio;
  }

  // activos: confirmada y la función no ha pasado · proximos: dentro de 3 días · historial: usada/cancelada/pasada
  function estadoReserva(r) {
    if (r.estado !== 'confirmada') return 'historial';
    const inicio = fechaDesdeISO(r.fechaISO, r.hora).getTime();
    const ahora = HOY_DEMO.getTime();
    if (inicio < ahora) return 'historial';
    return inicio - ahora <= 3 * 24 * 3600 * 1000 ? 'proximos' : 'activos';
  }

  /* ---------- Código QR (biblioteca qrcode-generator, MIT) ---------- */
  function textoQR(r) {
    return 'CINEPASS-DEMO|NO_VALIDO|' + r.folio + '|' + r.fechaISO + ' ' + r.hora + '|' + r.sala + '|' + r.asientos.join(',');
  }

  function qrSVG(r) {
    if (typeof window.qrcode !== 'function') return '';
    const qr = window.qrcode(0, 'M');
    qr.addData(textoQR(r));
    qr.make();
    const n = qr.getModuleCount();
    let d = '';
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (qr.isDark(y, x)) d += 'M' + x + ' ' + y + 'h1v1h-1z';
    return '<svg viewBox="0 0 ' + n + ' ' + n + '" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" role="img" aria-label="Código QR del folio ' + r.folio + '"><path d="' + d + '" fill="#0b0f19"/></svg>';
  }

  function qrMatriz(r) {
    if (typeof window.qrcode !== 'function') return null;
    const qr = window.qrcode(0, 'M');
    qr.addData(textoQR(r));
    qr.make();
    return qr;
  }

  window.CinePassReserva = {
    PELICULAS, FUNCIONES, CLAVE_ACTUAL,
    leerContexto, obtenerReservas, guardarReserva, choqueDeAsientos, folioNuevo, estadoReserva,
    fechaLegible, partesFecha, horaLegible, dinero, listaAsientos, qrSVG, qrMatriz
  };
})();
