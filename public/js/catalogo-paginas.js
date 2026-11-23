/* CinePass: tarjetas de película desde un catálogo único de demostración.
   Renderizado mediante DOM y textContent: evita inyectar datos como HTML.
*/
(function () {
  'use strict';
  const catalogo = window.CinePassCatalogo;
  if (!catalogo) return;
  const crear = (etiqueta, clase, texto) => {
    const e = document.createElement(etiqueta);
    if (clase) e.className = clase;
    if (texto !== undefined) e.textContent = texto;
    return e;
  };

  function tarjeta(p, encabezado) {
    const card = crear('article','tarjeta');
    card.dataset.titulo = p.nombre;
    card.dataset.genero = p.genero;
    card.dataset.peliculaId = p.id;

    const poster = crear('div','poster ' + (p.cartel ? 'poster-foto' : p.posterClase));
    if (p.cartel) {
      const img = crear('img','poster-imagen');
      img.src = p.cartel;
      img.alt = 'Cartel de ' + p.nombre;
      img.loading = 'lazy';
      poster.appendChild(img);
    } else {
      poster.setAttribute('aria-hidden','true');
      poster.append(crear('span','poster-simbolo',p.simbolo),crear('span','poster-lema',p.lema));
    }
    const content = crear('div','tarjeta-contenido');
    content.append(crear('span','categoria',p.genero),crear(encabezado,'',p.nombre),
      crear('p','',p.duracion + ' min · Clasificación ' + p.clasificacion));

    // Lance desarrolla Detalle/Asientos; este enlace NO finge que ya están listos.
    const detalle = crear('span','detalle-pendiente','Detalle de película: en desarrollo');
    content.appendChild(detalle);

    if (p.funcionDemo) {
      const boton = crear('a','enlace-demo-reserva','Probar reserva (DEMO) →');
      boton.href = '#';
      boton.dataset.reservaDemo = p.id;
      boton.setAttribute('aria-label','Probar una reserva simulada de ' + p.nombre);
      content.appendChild(boton);
    }
    card.append(poster,content);
    return card;
  }

  // Los artículos originales del HTML quedan como contenido de respaldo sin JS.
  const cartelera = document.getElementById('lista-peliculas');
  if (cartelera) {
    cartelera.replaceChildren(...catalogo.peliculas.map(p => tarjeta(p,'h2')));
    const buscador = document.getElementById('buscar-pelicula');
    const selector = document.getElementById('filtrar-genero');
    const contador = document.getElementById('contador-peliculas');
    const sinResultados = document.getElementById('sin-resultados');
    const normalizar = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
    function filtrar() {
      const query = normalizar(buscador.value);
      const genero = selector.value;
      let visibles = 0;
      cartelera.querySelectorAll('.tarjeta').forEach(card => {
        const mostrar = normalizar(card.dataset.titulo).includes(query) && (genero === 'todos' || genero === card.dataset.genero);
        card.hidden = !mostrar;
        if (mostrar) visibles++;
      });
      contador.textContent = 'Mostrando ' + visibles + ' de ' + catalogo.peliculas.length + ' películas de ejemplo';
      sinResultados.hidden = visibles !== 0;
    }
    buscador.addEventListener('input',filtrar);
    selector.addEventListener('change',filtrar);
    filtrar();
  }

  const destacadas = document.getElementById('peliculas-destacadas');
  if (destacadas) destacadas.replaceChildren(...catalogo.peliculas.filter(p=>p.destacada).map(p=>tarjeta(p,'h3')));

  // Para DEMO elegimos dos asientos de muestra libres en ESTA pestaña, sin ocupar los reales.
  // No reemplaza la disponibilidad de Lance ni la validación en el servidor.
  function asientosDePrueba(funcionId) {
    let ocupados = new Set();
    try {
      const r = JSON.parse(sessionStorage.getItem('cinepass_reservas_v3_claude'));
      if (Array.isArray(r)) r.forEach(reserva => {
        if (reserva && !reserva.ejemplo && reserva.funcionId === funcionId && reserva.estado === 'confirmada') {
          (reserva.asientos || []).forEach(a => ocupados.add(String(a).toUpperCase()));
        }
      });
    } catch (_) { /* Modo demo aún puede abrirse si no hay almacenamiento. */ }
    const pares = [['D5','D6'],['D1','D2'],['D3','D4'],['D7','D8'],['A1','A2'],['C1','C2'],['F1','F2'],['G5','G6']];
    return pares.find(par => par.every(a => !ocupados.has(a)));
  }
  document.addEventListener('click', function(e) {
    const enlace = e.target.closest('[data-reserva-demo]');
    if (!enlace) return;
    e.preventDefault();
    const pelicula = catalogo.porId[enlace.dataset.reservaDemo];
    if (!pelicula || !pelicula.funcionDemo) return;
    const asientos = asientosDePrueba(pelicula.funcionDemo);
    if (!asientos) { window.alert('Ya se usaron los asientos de prueba. Puedes cancelar una reserva desde Mis boletos para volver a intentarlo.'); return; }
    const parametros = new URLSearchParams({pelicula:pelicula.id,funcion:pelicula.funcionDemo,asientos:asientos.join(',')});
    location.assign('confirmacion.html?' + parametros.toString());
  });
})();
