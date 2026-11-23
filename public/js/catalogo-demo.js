/* CINEPASS · Catálogo único de películas de DEMOSTRACIÓN.
   Los datos se comparten entre Inicio, Cartelera y el flujo de reserva de Iván.
   Próximo reemplazo: GET /api/peliculas y GET /api/funciones.
   Los módulos de Detalle y Asientos de Lance NO se implementan aquí. */
(function () {
  'use strict';
  const peliculas = [
    {id:'orbita-9',nombre:'Órbita 9',genero:'Ciencia ficción',duracion:120,clasificacion:'B',posterClase:'poster-uno',simbolo:'✦',lema:'MÁS ALLÁ DE LAS ESTRELLAS',destacada:true,cartel:'img/poster-orbita-9.svg'},
    {id:'sombras',nombre:'Sombras del Faro',genero:'Misterio',generoDetalle:'Misterio / Suspenso',duracion:105,clasificacion:'B15',posterClase:'poster-dos',simbolo:'◆',lema:'EL MISTERIO TE ESPERA',destacada:true,cartel:'img/poster-sombras-del-faro.svg',arteBoleto:'img/boleto-sombras-faro.svg',calificacion:8.4,votos:2316,sinopsis:'Un pueblo costero, un faro y un oscuro secreto del pasado que sale a la luz.',precioBoleto:90,funcionDemo:'demo-01'},
    {id:'aventura-pixel',nombre:'Aventura Pixel',genero:'Animación',duracion:95,clasificacion:'A',posterClase:'poster-tres',simbolo:'★',lema:'EL JUEGO APENAS COMIENZA',destacada:true,cartel:'img/poster-aventura-pixel.svg'},
    {id:'ruta-salvaje',nombre:'Ruta Salvaje',genero:'Aventura',duracion:112,clasificacion:'B',posterClase:'poster-cuatro',simbolo:'▲',lema:'NADA ESTÁ ESCRITO',cartel:'img/poster-ruta-salvaje.svg'},
    {id:'ultima-toma',nombre:'La Última Toma',genero:'Drama',duracion:108,clasificacion:'B',posterClase:'poster-cinco',simbolo:'◈',lema:'UNA HISTORIA POR CONTAR',cartel:'img/poster-la-ultima-toma.svg'},
    {id:'codigo-eclipse',nombre:'Código Eclipse',genero:'Acción',duracion:118,clasificacion:'B15',posterClase:'poster-seis',simbolo:'✧',lema:'CADA SEGUNDO CUENTA',cartel:'img/poster-codigo-eclipse.svg'}
  ];
  const porId = Object.freeze(Object.fromEntries(peliculas.map(p => [p.id,Object.freeze(p)])));
  window.CinePassCatalogo = Object.freeze({peliculas:Object.freeze(peliculas),porId});
})();
