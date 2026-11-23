/* CinePass | Confirmar reservación.
   Basado en el módulo de Iván Vladimir: resumen, validaciones por campo,
   método de pago simulado y paso a Mis boletos.
   Los datos se guardan en sessionStorage SOLAMENTE para la demostración.
*/
(function () {
  'use strict';
  const API = window.CinePassReserva;
  const ctx = API.leerContexto();
  const $ = id => document.getElementById(id);
  const poner = (id, valor) => { $(id).textContent = valor; };

  /* ---------- Resumen ---------- */
  const peli = ctx.pelicula;
  $('resumen-poster').src = peli.cartel;
  $('resumen-poster').alt = 'Cartel de ' + peli.nombre;
  poner('resumen-titulo', peli.nombre);
  poner('resumen-clasificacion', peli.clasificacion);
  poner('resumen-duracion', peli.duracion + ' min');
  poner('resumen-genero', peli.genero);
  poner('resumen-calificacion', peli.calificacion.toFixed(1));
  poner('resumen-votos', '(' + new Intl.NumberFormat('en-US').format(peli.votos) + ' calificaciones)');
  poner('resumen-sinopsis', peli.sinopsis);
  poner('resumen-fecha', API.fechaLegible(ctx.funcion.fechaISO));
  poner('resumen-hora', API.horaLegible(ctx.funcion.hora));
  poner('resumen-sala', ctx.funcion.sala);
  poner('resumen-asientos', ctx.asientos.length ? API.listaAsientos(ctx.asientos) : 'Sin seleccionar');
  poner('resumen-cantidad', ctx.asientos.length + (ctx.asientos.length === 1 ? ' boleto' : ' boletos'));
  poner('resumen-total', API.dinero(ctx.total));

  /* ---------- Avisos ---------- */
  let temporizador;
  function toast(texto, error) {
    const t = $('toast');
    t.textContent = texto;
    t.classList.toggle('error', !!error);
    t.classList.add('visible');
    clearTimeout(temporizador);
    temporizador = setTimeout(() => t.classList.remove('visible'), 4200);
  }

  function errorCampo(id, mensaje) {
    const p = $('error-' + id);
    p.textContent = mensaje || '';
    p.hidden = !mensaje;
    const control = $(id);
    if (control) control.setAttribute('aria-invalid', String(!!mensaje));
  }

  /* ---------- Método de pago ---------- */
  const metodos = Array.from(document.querySelectorAll('[data-metodo]'));
  let metodo = 'Tarjeta';
  function elegir(boton) {
    metodo = boton.dataset.metodo;
    metodos.forEach(b => {
      const activo = b === boton;
      b.classList.toggle('seleccionado', activo);
      b.setAttribute('aria-checked', String(activo));
      b.tabIndex = activo ? 0 : -1;
    });
  }
  metodos.forEach((b, i) => {
    b.addEventListener('click', () => elegir(b));
    // Flechas para moverse entre opciones (patrón radiogroup)
    b.addEventListener('keydown', e => {
      if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
      e.preventDefault();
      const paso = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
      const sig = metodos[(i + paso + metodos.length) % metodos.length];
      elegir(sig); sig.focus();
    });
  });
  elegir(metodos[0]);

  /* ---------- Términos ---------- */
  $('abrir-terminos').addEventListener('click', e => {
    e.preventDefault();
    const d = $('dialogo-terminos');
    if (typeof d.showModal === 'function') d.showModal();
  });

  ['nombre', 'correo', 'telefono'].forEach(id => $(id).addEventListener('input', () => errorCampo(id, '')));
  $('terminos').addEventListener('change', () => errorCampo('terminos', ''));

  /* ---------- Envío ---------- */
  $('formulario-confirmacion').addEventListener('submit', e => {
    e.preventDefault();
    const nombre = $('nombre').value.trim().replace(/\s+/g, ' ');
    const correo = $('correo').value.trim();
    const telefono = $('telefono').value.trim();
    const digitos = telefono.replace(/\D/g, '');
    let valido = true;
    const revisar = (id, ok, mensaje) => { errorCampo(id, ok ? '' : mensaje); if (!ok) valido = false; };

    revisar('nombre', nombre.length >= 3 && nombre.length <= 100 && nombre.split(' ').length >= 2, 'Escribe tu nombre y al menos un apellido.');
    revisar('correo', /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo), 'Escribe un correo electrónico válido.');
    revisar('telefono', !telefono || digitos.length === 10 || (digitos.length === 12 && digitos.startsWith('52')),
      'El teléfono debe tener 10 dígitos (puedes anteponer +52).');
    revisar('terminos', $('terminos').checked, 'Debes aceptar los términos y condiciones.');

    if (!ctx.asientos.length) { valido = false; toast('No hay asientos seleccionados. Regresa al paso anterior.', true); }
    if (!valido) { document.querySelector('[aria-invalid="true"]')?.focus(); return; }

    if (API.choqueDeAsientos(ctx.funcion.id, ctx.asientos)) {
      toast('Esos asientos ya están reservados en esta función. Elige otros.', true);
      return;
    }

    const reserva = {
      folio: API.folioNuevo(),
      peliculaId: peli.id,
      funcionId: ctx.funcion.id,
      fechaISO: ctx.funcion.fechaISO,
      hora: ctx.funcion.hora,
      sala: ctx.funcion.sala,
      asientos: ctx.asientos.slice(),
      precioBoleto: ctx.precio,
      cliente: nombre,
      correo,
      telefono: digitos.slice(-10),
      metodo,
      estado: 'confirmada',
      creadaEn: new Date().toISOString(),
      ejemplo: false
    };

    if (!API.guardarReserva(reserva)) {
      toast('No pudimos guardar la reservación en este navegador.', true);
      return;
    }
    e.submitter && (e.submitter.disabled = true);
    location.assign('mis-boletos.html?folio=' + encodeURIComponent(reserva.folio));
  });
})();
